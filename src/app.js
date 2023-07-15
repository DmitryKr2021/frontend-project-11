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

  const watchedState = onChange(state, render(elements));

  const schema = yup.object({
    url: yup.string().url(),
  });

  const validate = (input) => schema.validate(
    { url: input.value },
  );

  const schemaRepeatUrl = yup.object({
    // url: yup.string().notOneOf(watchedState.loadedUrls),
    url: yup.string().notOneOf(Object.values(watchedState.loadedUrls)),
    // url: yup.string().notOneOf(['https://ru.hexlet.io/lessons.rss']),
  });

  // const schemaRepeatUrl = yup.string().notOneOf(Object.values(watchedState.loadedUrls));

  // const schemaRepeatUrl = yup.string().notOneOf(['aaa', 'bbb']);

  const validateRepeatUrl = (input) => schemaRepeatUrl.validate(
    { url: input },
  );

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('urls=', Object.values(watchedState.loadedUrls));
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
      //.then(() => {
        validateRepeatUrl('https://ru.hexlet.io/lessons.rss')
        // validateRepeatUrl(input)
          .then(() => console.log('+++++'))
          .catch(() => console.log('------'));
     // });
  });
};

export default app;
