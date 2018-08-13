# Uload tiny upload client

Turn any element into an upload button. Uploads files through Ajax with progress support.

### Usage
```javascript
<span class="upload">
  <input type="file" style="display:none">
  <button>Upload</button>
  <span class="progress"></span>
</span>

<script>
  document.addEventListener('DOMContentLoaded', function() {
    window.upload({
      before: function (uploader) {
        console.log('BEFORE UPLOADING')
      },
      success: function (data, uploader) {
        var url = data.url
        var key = uploader.getAttribute('data-key')
        var params = {}
        params[key] = data.url

        // Save image
        $.ajax('/image/save', {
          method: 'POST',
          data: 'keys=' + JSON.stringify(params),
          success: function () {
            console.log('Success: ', url)
            // Update image
            uploader.setAttribute('src', url)
          },
          error: function (err) {
            console.log('AJAX ERROR')
          }
        })
      },
      error: function () {
        console.log('UPLOAD ERROR')
      },
      progress: function (progress) {
        console.log(progress)
      }
    })
  })
</script>
```
MIT Licensed. Enjoy!
