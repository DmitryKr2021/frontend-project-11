import axios from 'axios';
import onChange from 'on-change';
import render from './view.js';
import parse from './parse.js';

const getNewUrl = (url) => {
  const baseUrl = 'https://allorigins.hexlet.app';
  const params = new URLSearchParams({ disableCache: true, url }).toString();
  return new URL(`/get?${params}`, baseUrl);
};

const update = (state, elements, i18n) => {
  const watchedState = onChange(state, render(elements, i18n));

  const loadPosts = (feed) => {
    const { feedUrl, feedDescription } = feed;
    axios.get(getNewUrl(feedUrl))
      .then((response) => {
        const parseResult = parse(response.data.contents, 'text/xml', 'post');
        watchedState.loadedPosts = { feedDescription, ...parseResult };
      })
      .catch(() => {
        watchedState.loadError = 'disconnect';
        throw new Error('Ошибка сети');
      });
  };

  const updatePost = (feeds = watchedState.loadedFeeds) => {
    if (!watchedState.loadError) {
      feeds.forEach((feed) => {
        try {
          loadPosts(feed);
          setTimeout(updatePost, 5000);
        } catch {
          watchedState.loadError = 'disconnect';
          throw new Error('Ошибка сети');
        }
      });
    }
  };
  setTimeout(updatePost, 5000);
};
export default update;
