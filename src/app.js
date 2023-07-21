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

  /* const loadData = (url) => {
    fetch(`https://allorigins.hexlet.app/get?disableCache=true&url=${url}`)
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error('Network response was not ok.');
      })
      .then((data) => {
        watchedState.loadedContents.push(data.contents);
      });
  }; */

  const loadData = (url) => {
    axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${url}`)
      /*.then((response) => {
        if (response.ok) return response.json();
       // throw new Error('Network response was not ok.');
       console.log('resp data=', response.data);
      })*/
      .then((response) => {
        watchedState.loadedContents.push(response.data.contents);
      })
      .catch((err) => console.log('error=', err));
  };

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const { input } = elements;
    validateUrl(input, Object.values(watchedState.loadedUrls))
      .then(() => {
        watchedState.loadedUrls.push(input.value);
        watchedState.url = input.value;
        watchedState.error = null;
        loadData(watchedState.url);
      })
      .catch((err) => {
        watchedState.error = err.errors[0].key;
      });
  });
};

export default app;
