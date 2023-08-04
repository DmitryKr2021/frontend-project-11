import i18next from 'i18next';
import resources from '../locales/index.js';
import app from '../app.js';

export default () => {
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
    .then(() => {});

  const state = {
    url: '',
    loadedUrls: [],
    error: null,
    /* urlInvalid, urlExist, noRss */
    loadedFeeds: [],
    /* feed = {
      feedUrl,
      feedTitle,
      feedDescription,
      feedPosts: [
        post = {
          postLink,
          postTitle,
          postDescription,
        }]
    } */
    loadedPosts: {},
    /*
    feedDescription,
    posts: [
      post = {
          postLink,
          postTitle,
          postDescription,
      }]
    */
    loadProcess: {
      state: 'initial',
      /* readyToLoad, loadInProcess, successLoad, failedLoad */
    },
  };

  const elements = {
    feedback: document.querySelector('.feedback'),
    form: document.querySelector('form'),
    input: document.getElementById('url-input'),
    feeds: document.querySelector('.feeds'),
    posts: document.querySelector('.posts'),
  };

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    app(state, elements, i18n);
  });
};
