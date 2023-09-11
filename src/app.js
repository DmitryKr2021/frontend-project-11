import onChange from 'on-change';
import * as yup from 'yup';
import axios from 'axios';
import i18next from 'i18next';
import resources from './locales/index.js';
import update, { getNewUrl } from './modules/update.js';
import render from './modules/view.js';
import parse from './modules/parse.js';

const app = () => {
  const elements = {
    feedback: document.querySelector('.feedback'),
    form: document.querySelector('form'),
    input: document.getElementById('url-input'),
    feeds: document.querySelector('.feeds'),
    postsHtml: document.querySelector('.posts'),
  };
  const state = {
    urls: [],
    feeds: [],
    posts: [],
    form: {
      error: null, // urlInvalid, urlExist
      status: 'valid', // inValid
    },
    load: {
      status: 'initial', // loadInProcess, successLoad, failedLoad
      error: null, // noRss, disconnect
    },
    parse: {
      error: null, // noRss
    },
  };
  const defaultLang = 'ru';
  const i18n = i18next.createInstance();
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
    watchedState.status = 'loadInProcess';
    axios.get(getNewUrl(url))
      .then((response) => {
        const parseResult = parse(response.data.contents);
        watchedState.status = 'successLoad';
        const newFeed = { url, ...parseResult };
        watchedState.feeds.push(newFeed);
        watchedState.urls.push(url);
        watchedState.load.error = null;
        watchedState.form.url = url;
      })
      .catch((e) => {
        watchedState.status = 'failedLoad';
        if (e.tagName) {
          watchedState.parse.error = 'noRss';
        } else {
          watchedState.load.error = 'disconnect';
        }
      });
  };

  const { input } = elements;

  const onSubmit = () => {
    validateUrl(input, Object.values(watchedState.urls))
      .then(() => {
        watchedState.status = 'loadInProcess';
        loadFeed(input.value);
      })
      .catch((err) => {
        watchedState.form.error = err.errors[0].key;
        watchedState.form.status = 'inValid';
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
