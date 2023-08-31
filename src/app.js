import onChange from 'on-change';
import * as yup from 'yup';
import axios from 'axios';
import render from './modules/view.js';
import parse from './modules/parse.js';

const app = (state, elements, i18n) => {
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

  const getNewUrl = (url) => {
    const baseUrl = 'https://allorigins.hexlet.app';
    const params = new URLSearchParams({ disableCache: true, url }).toString();
    return new URL(`/get?${params}`, baseUrl);
  };

  const loadFeed = (url) => {
    watchedState.loadState = 'loadInProcess';
    axios.get(getNewUrl(url))
      .then((response) => {
        const parseResult = parse(response.data.contents, 'text/xml', 'feed');
        if (!parseResult) {
          watchedState.loadState = 'failedLoad';
          watchedState.loadError = 'noRss';
          return;
        }
        watchedState.loadState = 'successLoad';
        const newFeed = { feedUrl: url, ...parseResult };
        watchedState.loadedFeeds.push(newFeed);
        watchedState.loadedUrls.push(url);
        watchedState.loadError = null;
        watchedState.url = url;
      })
      .catch(() => {
        watchedState.loadState = 'failedLoad';
        watchedState.loadError = 'disconnect';
      });
  };

  const { input, form } = elements;

  const onSubmit = () => {
    validateUrl(input, Object.values(watchedState.loadedUrls))
      .then(() => {
        watchedState.formError = null;
        watchedState.loadState = 'readyToLoad';
      })
      .then(() => {
        loadFeed(input.value);
      })
      .catch((err) => {
        watchedState.formError = err.errors[0].key;
      });
  };

  form.addEventListener('submit', onSubmit());
};

export default app;
