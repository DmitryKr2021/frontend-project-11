import onChange from 'on-change';
import * as yup from 'yup';
import render from './modules/View.js';

const app = () => {
  const state = {
    url: '',
    urlValid: true,
    loadedUrls: [],
    error: '',
  };

  const elements = {
    feedback: document.querySelector('.feedback'),
    form: document.querySelector('form'),
    input: document.getElementById('url-input'),
  };

  const watchedState = onChange(state, render(elements));

  const baseUrlSchema = yup.string().url().required();

  const validateUrl = (input, feedUrls) => {
    const actualUrlSchema = baseUrlSchema.notOneOf(feedUrls);
    return actualUrlSchema.validate(input.value);
  };

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const { input } = elements;
    validateUrl(input, Object.values(watchedState.loadedUrls))
      .then(() => {
        watchedState.loadedUrls.push(input.value);
        watchedState.url = input.value;
        watchedState.urlValid = true;
        watchedState.error = '';
      })
      .catch((err) => {
        watchedState.urlValid = false;
        [watchedState.error] = err.errors;
      });
  });
};

export default app;
