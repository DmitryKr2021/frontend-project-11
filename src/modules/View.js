import i18next from 'i18next';
import resources from '../locales/resources.js';

const defaultLang = 'ru';
const texts = {};

const i18n = i18next.createInstance();
i18n.init({
  lng: defaultLang,
  debug: true,
  resources,
})
  .then((t) => {
    texts.rssLoad = i18n.t(['rssLoaded']);
    // texts.rssLoad = resources.translation.rssLoaded;
  });

const handleValidUrl = (elements) => {
  const { feedback, form, input } = elements;
  feedback.textContent = texts.rssLoad;
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
