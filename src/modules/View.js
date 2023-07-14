const handleValidUrl = (elements) => {
  const { feedback, form, input } = elements;
  feedback.textContent = 'RSS успешно загружен';
  feedback.classList.remove('text-danger');
  feedback.classList.add('text-success');
  input.classList.remove('is-invalid');
  setTimeout(() => form.reset(), 100);
};

const handleNotValidUrl = (elements) => {
  const { feedback, input } = elements;
  feedback.textContent = 'Ссылка должна быть валидным URL';
  feedback.classList.add('text-danger');
  feedback.classList.remove('text-success');
  input.classList.add('is-invalid');
};

const render = (elements) => (path, value) => {
  if (path === 'urlValid' && !value) {
    handleNotValidUrl(elements);
  } else { handleValidUrl(elements); }
};


  /* if ((watchedState.loadedUrls).includes(state.url)) {
    feedback.textContent = 'RSS уже существует';
    feedback.classList.add('text-danger');
    feedback.classList.remove('text-success');
    input.classList.add('is-invalid');
    return;
  } */

export default render;
