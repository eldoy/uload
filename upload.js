(function() {

  var init = function(uploader, options) {
    // Getting the config
    var config = uploader.getAttribute('data-config')

    // Getting the file input field
    var input = uploader.querySelector('input')

    // Create an input if none available
    if (!input) {
      input = document.createElement('input')
      input.type = 'file'
    }

    // Hiding the file input
    input.style.display = 'none'

    // Getting the upload button
    var button = uploader.querySelector(options.button)

    // Use the upload element as button if none exists
    if (!button) {
      button = uploader
      uploader.fileInput = input
    }

    // Getting the progress element and clearing it
    var progressElement = uploader.querySelector('.progress')

    // Clicking the button will click the hidden upload field
    button.addEventListener('click', function(event) {
      event.preventDefault()

      // Clear the progress element
      if (progressElement) {
        progressElement.textContent = ''
      }

      // Reset file field
      input.value = null

      // Click the hidden file field
      input.click()
    })

    // This event is called when a file has been added
    input.addEventListener('change', function(event) {
      // Get all the files
      var files = input.files

      // Add files to form data, supports multiple files
      var formData = new FormData()
      for (var j = 0; j < files.length; j++) {
        var file = files[j]

        // Only support image files
        if (file.type.match('image.*')) {
          formData.append('file', file, file.name)
        }
      }

      // Append config if available
      if (config) {
        formData.append('config', config)
      }

      // Upload with ajax request
      var xhr = new XMLHttpRequest()
      xhr.open('POST', options.url, true)

      // Run the before callback
      if (options.before) {
        options.before(uploader)
      }

      // Set headers
      xhr.setRequestHeader('Accept', 'application/json')
      xhr.setRequestHeader('Cache-Control', 'no-cache')
      xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')

      // Upload progress
      if (options.progress) {
        let progress = xhr.upload || xhr
        progress.onprogress = function (event) {
          // Calculate percentage uploaded
          var percent = (event.loaded / event.total) * 100

          // Run progress function
          if (typeof options.progress === 'function') {
            options.progress(percent, uploader)
          }

          // Update proress element
          if (progressElement) {
            progressElement.textContent = percent + '%'
          }
        }
      }

      // Error handling, not doing anything at the moment
      xhr.onerror = function (event) {}

      // Event for when ajax request is complete
      xhr.onload = function () {
        if (xhr.status === 200) {
          // Parse the response, should be JSON and
          // contain the URL of the uploaded file
          var data = JSON.parse(xhr.responseText)

          // Call the success callback
          if (options.success) {
            options.success(data, uploader, xhr)
          }

        } else {
          // Call the error callback
          if (options.error) {
            options.error(uploader, xhr)
          }
        }
      }

      // Send data
      xhr.send(formData)
    })
  }

  var upload = function(options) {

    // Default selector for the wrapper is .uploader
    if (!options.selector) {
      options.selector = '.upload'
    }

    // Default url is /upload
    if (!options.url) {
      options.url = '/upload'
    }

    // Default selector for the button is button
    if (!options.button) {
      options.button = 'button'
    }

    // Find all upload elements
    var uploaders = document.querySelectorAll(options.selector)

    // Set up each upload element
    for (var i = 0; i < uploaders.length; i++) {
      var uploader = uploaders[i]

      // Call initializer
      init(uploader, options)
    }
  }

  // Expose function as upload
  window.upload = upload
}())
