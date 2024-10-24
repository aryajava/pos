const $imageInput = $('#imageInput');
const $previewRow = $('#previewRow');
const $previewImage = $('#preview');

const updatePreview = () => {
  const file = $imageInput[0].files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      $previewImage.attr('src', e.target.result);
      $previewRow.show();
    };
    reader.readAsDataURL(file);
  } else if ($previewImage.attr('src')) {
    $previewRow.show();
  } else {
    $previewRow.hide();
  }
}

$(document).ready(function () {
  updatePreview();
  $imageInput.on('change', updatePreview);
});