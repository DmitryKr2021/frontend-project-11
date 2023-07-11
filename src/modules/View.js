import _ from 'lodash';
import onChange from 'on-change';
import validate from './Validate';

const feedback = document.querySelector('.feedback');
const form = document.querySelector('form');
const input = document.getElementById('url-input');

const state = {
  url: '',
  urlValid: true,
  loadedUrls: [],
};

const watchedState = onChange(state, (path, current, previous) => {
  const ifUrlValid = () => {
    state.urlValid = true;
    feedback.textContent = 'RSS успешно загружен';
    feedback.classList.remove('text-danger');
    feedback.classList.add('text-success');
    input.classList.remove('is-invalid');
    state.loadedUrls.push(watchedState.url);
    form.reset();
  };

  const ifUrlNotValid = () => {
    state.urlValid = false;
    feedback.textContent = 'Ссылка должна быть валидным URL';
    feedback.classList.add('text-danger');
    feedback.classList.remove('text-success');
    input.classList.add('is-invalid');
  };

  validate(state)
    .then((stateNow) => {
      ifUrlValid();
      console.log('No error', stateNow);
    })
    .catch((err) => {
      ifUrlNotValid();
      console.log(err, state);
    });

  /* if ((watchedState.loadedUrls).includes(state.url)) {
    feedback.textContent = 'RSS уже существует';
    feedback.classList.add('text-danger');
    feedback.classList.remove('text-success');
    input.classList.add('is-invalid');
    return;
  } */
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  watchedState.url = input.value;
});
