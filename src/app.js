import onChange from 'on-change';
import * as yup from 'yup';
import axios from 'axios';
import i18next from 'i18next';
import resources from './locales/index.js';
import update from './modules/update.js';
import render from './modules/view.js';
import parse from './modules/parse.js';

const elements = {
  feedback: document.querySelector('.feedback'),
  form: document.querySelector('form'),
  input: document.getElementById('url-input'),
  feeds: document.querySelector('.feeds'),
  posts: document.querySelector('.posts'),
};

const state = {
  form: {
    url: '',
    error: null, // urlInvalid, urlExist
    state: 'valid', // inValid
  },
  load: {
    urls: [],
    feeds: [],
    posts: {},
    state: 'initial', // readyToLoad, loadInProcess, successLoad, failedLoad
    error: null, // noRss, disconnect
  },
};
const defaultLang = 'ru';
const i18n = i18next.createInstance();
const getNewUrl = (url) => {
  const baseUrl = 'https://allorigins.hexlet.app';
  const params = new URLSearchParams({ disableCache: true, url }).toString();
  return new URL(`/get?${params}`, baseUrl);
};

const app = () => {
  const watchedState = onChange(state, render(elements, i18n));
  yup.setLocale({
    string: {
      url: () => ({ key: 'urlInvalid', values: {} }),
    },
    mixed: {
      notOneOf: () => ({ key: 'urlExist', values: {} }),
    },
  });

  const baseUrlSchema = yup.string().url().required();

  const validateUrl = (input, feedUrls) => {
    const actualUrlSchema = baseUrlSchema.notOneOf(feedUrls);
    return actualUrlSchema.validate(input.value);
  };

  const loadFeed = (url) => {
    watchedState.load.state = 'loadInProcess';
    axios.get(getNewUrl(url))
      .then((response) => {
        const parseResult = parse(response.data.contents);
        watchedState.load.state = 'successLoad';
        const newFeed = { feedUrl: url, ...parseResult };
        watchedState.load.feeds.push(newFeed);
        watchedState.load.urls.push(url);
        watchedState.load.error = null;
        watchedState.form.url = url;
      })
      .catch((e) => {
        watchedState.load.state = 'failedLoad';
        watchedState.load.error = e.tagName === 'parsererror' ? 'noRss' : 'disconnect';
      });
  };

  const { input } = elements;

  const onSubmit = () => {
    validateUrl(input, Object.values(watchedState.load.urls))
      .then(() => {
        watchedState.form.error = null;
        watchedState.load.state = 'readyToLoad';
        loadFeed(input.value);
      })
      .catch((err) => {
        watchedState.form.error = err.errors[0].key;
        watchedState.form.state = 'inValid';
      });
  };
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
        onSubmit();
      });
      update(state, elements, i18n);
    });
};

export default app;
