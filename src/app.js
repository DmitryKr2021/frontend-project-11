import onChange from 'on-change';
import * as yup from 'yup';
import axios from 'axios';
import render from './modules/View.js';

const app = () => {
  const state = {
    url: '',
    loadedUrls: [],
    error: null,
    loadedContents: [],
  };

  const elements = {
    feedback: document.querySelector('.feedback'),
    form: document.querySelector('form'),
    input: document.getElementById('url-input'),
    feeds: document.querySelector('.feeds'),
    posts: document.querySelector('.posts'),
  };

  const watchedState = onChange(state, render(elements));

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

  const parse = (parser, data, format) => {
    const result = parser.parseFromString(data, format);
    return result.getElementsByTagName('parsererror')[0] ? false : result;
  };

  const loadData = (url) => {
    const updatePost = (loadedUrl) => {
      setTimeout(() => {
        loadData(loadedUrl);
      }, 5000);
    };

    axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${url}`)
      .then((response) => {
        const parseResult = parse(new DOMParser(), response.data.contents, 'text/xml');
        if (!parseResult) {
          watchedState.error = 'noRss';
          return;
        }
        const loaded = watchedState.loadedContents.find((elem) => elem.url === url);
        // if RSS loaded => update
        if (loaded) { loaded.content = parseResult; } else {
        // if RSS is new => load
          watchedState.loadedContents.push({
            url,
            content: parseResult,
          });
          watchedState.loadedUrls.push(url);
          watchedState.error = null;
          watchedState.url = url;
        }
        updatePost(url);
      })
      .catch((err) => console.log('Ошибка сети', err));
  };

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const { input } = elements;
    validateUrl(input, Object.values(watchedState.loadedUrls))
      .then(() => {
        loadData(input.value);
      })
      .catch((err) => {
        watchedState.error = err.errors[0].key;
      });
  });
};

export default app;
