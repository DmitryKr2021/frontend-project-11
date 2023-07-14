import onChange from 'on-change';
import * as yup from 'yup';
import render from './modules/View.js';

const app = () => {
  const state = {
    url: '',
    urlValid: true,
    loadedUrls: [],
  };

  const elements = {
    feedback: document.querySelector('.feedback'),
    form: document.querySelector('form'),
    input: document.getElementById('url-input'),
  };

  /* const schema = yup.string().url();
  const validate = (url) => schema.validate(url); */

  const watchedState = onChange(state, render(elements));

  const schema = yup.object({
    url: yup.string().url().notOneOf(JSON.parse(JSON.stringify(state.loadedUrls))),
  });

  const validate = (input) => schema.validate(
    { url: input.value },
    console.log('urls=', JSON.parse(JSON.stringify(state.loadedUrls))),
  );

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const { input } = elements;
    validate(input)
      .then(() => {
        watchedState.loadedUrls.push(input.value);
        watchedState.url = input.value;
        watchedState.urlValid = true;
      })
      .catch(() => {
        watchedState.urlValid = false;
      });
  });
};

export default app;
