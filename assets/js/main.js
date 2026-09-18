const imageDialog = document.querySelector('#image-dialog');
const openImageButton = document.querySelector('#open-image');
const closeImageButton = document.querySelector('#close-image');

openImageButton.addEventListener('click', () => imageDialog.showModal());
closeImageButton.addEventListener('click', () => imageDialog.close());

imageDialog.addEventListener('click', (event) => {
  if (event.target === imageDialog) imageDialog.close();
});
