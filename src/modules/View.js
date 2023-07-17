const handleValidUrl = (elements) => {
  const { feedback, form, input } = elements;
  feedback.textContent = 'RSS успешно загружен';
  feedback.classList.remove('text-danger');
  feedback.classList.add('text-success');
  input.classList.remove('is-invalid');
  setTimeout(() => form.reset(), 100);
};

const handleNotValidUrl = (elements, errValue) => {
  const { feedback, input } = elements;
  const errorText = errValue === 'this must be a valid URL'
    ? 'Ссылка должна быть валидным URL'
    : 'RSS уже существует';
  feedback.textContent = errorText;
  feedback.classList.add('text-danger');
  feedback.classList.remove('text-success');
  input.classList.add('is-invalid');
};

const render = (elements) => (path, value) => {
  if (path === 'error' && value) {
    handleNotValidUrl(elements, value);
  } else { handleValidUrl(elements); }
};

export default render;
