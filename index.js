module.exports = function(params, options, config, result) {
  var data = new FormData()
  for (var key in params) {
   data.append(key, params[key])
  }
  config.headers = {
    ...config.headers,
    'content-type': 'multipart/form-data',
    'cache-control': 'no-cache'
  }
  var input = document.createElement('input')
  input.type = 'file'
  input.value = null
  if (options.multiple) {
    input.multiple = true
  }
  if (options.accept) {
    input.accept = options.accept
  }
  function change() {
    var files = input.files
    for (var file of files) {
     data.append('file', file, file.name)
    }
    if (options.progress) {
      config.onUploadProgress = function(event) {
        event.percent = Math.round((event.loaded * 100) / event.total)
        options.progress(event)
      }
    }
    result(params)
  }
  input.addEventListener('change', change)
  input.click()
}
