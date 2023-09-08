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
        const parseResult = parse(response.data.contents);
        const { feedPosts } = parseResult;
        watchedState.load.posts = { feedDescription, ...feedPosts };
        watchedState.load.error = null;
      })
      .catch((e) => {
        watchedState.load.state = 'failedLoad';
        watchedState.load.error = e.tagName === 'parsererror' ? 'noRss' : 'disconnect';
        throw new Error(watchedState.load.error);
      });
  };

  const updatePost = (feeds = watchedState.load.feeds) => {
    if (!watchedState.load.error) {
      const promiseAll = Promise.all(feeds.map((feed) => loadPosts(feed)));
      promiseAll
        .then(watchedState.load.error = null)
        .finally(setTimeout(() => updatePost(), 5000));
    }
  };

  updatePost();
};
export default update;
