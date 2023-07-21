import i18next from 'i18next';
import resources from '../locales/index.js';

const defaultLang = 'ru';
const texts = {};

const i18n = i18next.createInstance();
i18n.init({
  lng: defaultLang,
  debug: true,
  resources: {
    ru: resources.ru,
    en: resources.en,
  },
})
  .then(() => {
    texts.rssLoad = i18n.t('rssLoaded');
  });

const listFeed = [];
const addFeed = (feeds, title, description) => {
  const listGroup = feeds.querySelector('.list-group');
  const li = document.createElement('li');
  li.classList.add('list-group-item', 'border-0', 'border-end-0');
  const h3 = document.createElement('h3');
  h3.classList.add('h6', 'm-0');
  h3.textContent = title.textContent;
  li.append(h3);
  const p = document.createElement('p');
  p.classList.add('m-0', 'small', 'text-black-50');
  p.textContent = description.textContent;
  li.append(p);
  listFeed.push(li);
  listFeed.forEach((item) => listGroup.prepend(item));
};

const showFeeds = (elements, title, description) => {
  const { feeds } = elements;
  feeds.innerHTML = `<div class="card border-0">
  <div class="card-body">
    <h2 class="card-title h4">Фиды</h2>
  </div>
  <ul class="list-group border-0 rounded-0">
  </ul>
  </div>`;
  addFeed(feeds, title, description);
};

const listPost = [];
const addPost = (posts, items) => {
  const listGroup = posts.querySelector('.list-group');
  items.forEach((item) => {
    const title = item.querySelector('title');
    const link = item.querySelector('link');
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'border-0', 'border-end-0', 'd-flex', 'justify-content-between', 'align-items-start');
    li.innerHTML = `<a href= ${link.textContent}
    class="fw-bold" data-id="2" target="_blank" rel="noopener noreferrer">
    ${title.textContent}</a>
    <button type="button" class="btn btn-outline-primary btn-sm" 
    data-id="2" data-bs-toggle="modal" data-bs-target="#modal">Просмотр</button>`;
    listPost.push(li);
  });
  listPost.forEach((item) => listGroup.prepend(item));
};

const showPosts = (elements, items) => {
  const { posts } = elements;
  posts.innerHTML = `<div class="card border-0">
  <div class="card-body">
    <h2 class="card-title h4">Посты</h2>
  </div>
  <ul class="list-group border-0 rounded-0">
  </ul>
  </div>`;
  addPost(posts, items);
};

const parse = (parser, data, format) => parser.parseFromString(data, format);

const handleNotValidUrl = (elements, errValue) => {
  const { feedback, input } = elements;
  feedback.textContent = i18n.t(`errors.validation.${errValue}`);
  feedback.classList.add('text-danger');
  feedback.classList.remove('text-success');
  input.classList.add('is-invalid');
};

const handleValidUrl = (elements, path, value) => {
  console.log('value=', value);
  const {
    feedback, form, input,
  } = elements;
  if (path === 'loadedContents') {
    const parsedContent = parse(new DOMParser(), value.at(-1), 'text/xml');
    console.log(parsedContent);
    if (parsedContent.getElementsByTagName('parsererror')[0]) {
      handleNotValidUrl(elements, 'noRss');
    } else {
      const [title] = parsedContent.getElementsByTagName('title');
      const [description] = parsedContent.getElementsByTagName('description');
      showFeeds(elements, title, description);
      const items = Array.from(parsedContent.getElementsByTagName('item'));
      showPosts(elements, items);
      feedback.textContent = texts.rssLoad;
      feedback.classList.remove('text-danger');
      feedback.classList.add('text-success');
      input.classList.remove('is-invalid');
      setTimeout(() => form.reset(), 100);
    }
  }
};

const render = (elements) => (path, value) => {
  if (path === 'error' && value) {
    handleNotValidUrl(elements, value);
  } else { handleValidUrl(elements, path, value); }
};

export default render;
