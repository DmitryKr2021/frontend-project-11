import onChange from 'on-change';
import * as yup from 'yup';
import axios from 'axios';
import render from './modules/view.js';

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

  const parse = (data, format) => {
    const result = new DOMParser().parseFromString(data, format);
    return result.getElementsByTagName('parsererror')[0] ? false : result;
  };

  const getNewUrl = (url) => {
    const baseUrl = 'https://allorigins.hexlet.app';
    return new URL(`/get?disableCache=true&url=${url}`, baseUrl);
  };

  const loadPosts = (feed) => {
    const { feedUrl, feedDescription } = feed;
    const tempArr = [];
    const tempObj = {};
    axios.get(getNewUrl(feedUrl))
      .then((response) => {
        const parseResult = parse(response.data.contents, 'text/xml');
        const arr = Array.from(parseResult.getElementsByTagName('item'));
        tempObj.feedDescription = feedDescription;
        arr.forEach((item) => {
          const newPost = {
            postLink: item.querySelector('link').textContent,
            postTitle: item.querySelector('title').textContent,
            postDescription: item.querySelector('description').textContent,
          };
          tempArr.push(newPost);
        });
        tempObj.posts = tempArr.slice();
        watchedState.loadedPosts = { ...tempObj };
      })
      .catch(() => {});
  };

  const loadFeed = (url) => {
    watchedState.loadProcess.state = 'loadInProcess';
    axios.get(getNewUrl(url))
      .then((response) => {
        const parseResult = parse(response.data.contents, 'text/xml');
        if (!parseResult) {
          watchedState.loadProcess.state = 'failedLoad';
          watchedState.error = 'noRss';
          return;
        }
        watchedState.loadProcess.state = 'successLoad';

        const channel = parseResult.querySelector('channel');
        const feedTitle = channel.querySelector('title').textContent;
        const feedDescription = channel.querySelector('description').textContent;
        const arr = Array.from(parseResult.getElementsByTagName('item'));
        const newFeed = {
          feedUrl: url,
          feedTitle,
          feedDescription,
          feedPosts: arr.map((elem) => ({
            postLink: elem.querySelector('link').textContent,
            postTitle: elem.querySelector('title').textContent,
            postDescription: elem.querySelector('description').textContent,
          })),
        };
        watchedState.loadedFeeds.push(newFeed);
        watchedState.loadedUrls.push(url);
        watchedState.error = null;
        watchedState.url = url;
      })
      .catch((err) => {
        watchedState.loadProcess.state = 'failedLoad';
        console.log('Ошибка сети', err);
      });
  };

  const updatePost = (feeds = watchedState.loadedFeeds) => {
    if (!watchedState.error) {
      feeds.forEach((feed) => {
        try {
          loadPosts(feed);
          setTimeout(updatePost, 5000);
        // } catch { throw new Error('load failed'); }
        } catch { throw new Error('Ошибка сети'); }
      });
    }
  };

  const { input, form } = elements;

  const loadFromInputAddr = () => {
    validateUrl(input, Object.values(watchedState.loadedUrls))
      .then(() => {
        watchedState.error = null;
        watchedState.loadProcess.state = 'readyToLoad';
        loadFeed(input.value);
        setTimeout(updatePost, 5000);
      })
      .catch((err) => {
        watchedState.error = err.errors[0].key;
      });
  };

  form.addEventListener('submit', loadFromInputAddr());
};

export default app;
