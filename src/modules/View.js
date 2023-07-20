import i18next from 'i18next';
import resources from '../locales/index.js';

const defaultLang = 'ru';
const texts = {};

const i18n = i18next.createInstance();
i18n.init({
  lng: defaultLang,
  debug: true,
  resources: {
    ru: resources.ru,
    en: resources.en,
  },
})
  .then(() => {
    texts.rssLoad = i18n.t('rssLoaded');
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
  feedback.textContent = i18n.t(`errors.validation.${errValue}`);
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
