import i18next from 'i18next';
import resources from '../locales/index.js';
import app from '../app.js';
import update from './update.js';

export default () => {
  const elements = {
    feedback: document.querySelector('.feedback'),
    form: document.querySelector('form'),
    input: document.getElementById('url-input'),
    feeds: document.querySelector('.feeds'),
    posts: document.querySelector('.posts'),
  };

  const state = {
    url: '',
    loadedUrls: [],
    formError: null, // urlInvalid, urlExist
    loadedFeeds: [],
    loadedPosts: {},
    loadState: 'initial', // readyToLoad, loadInProcess, successLoad, failedLoad
    loadError: null, // noRss, disconnect
  };
  const defaultLang = 'ru';
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
      elements.form.addEventListener('submit', (e) => {
        e.preventDefault();
        app(state, elements, i18n);
      });
      update(state, elements, i18n);
    });
};
