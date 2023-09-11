import axios from 'axios';
import onChange from 'on-change';
import render from './view.js';
import parse from './parse.js';

export const getNewUrl = (url) => {
  const urlWithProxy = new URL('/get', 'https://allorigins.hexlet.app');
  urlWithProxy.searchParams.set('url', url);
  urlWithProxy.searchParams.set('disableCache', 'true');
  return urlWithProxy.toString();
};

const update = (state, elements, i18n) => {
  const watchedState = onChange(state, render(elements, i18n));

  const loadPosts = (feed) => {
    const { url, description } = feed;
    axios.get(getNewUrl(url))
      .then((response) => {
        const parseResult = parse(response.data.contents);
        const { posts } = parseResult;
        watchedState.posts = [description, ...posts];
      });
  };

  const updatePost = (feeds = watchedState.feeds) => {
    const promiseAll = Promise.all(feeds.map((feed) => loadPosts(feed)));
    promiseAll
      .finally(setTimeout(() => updatePost(), 5000));
  };

  updatePost();
};
export default update;
