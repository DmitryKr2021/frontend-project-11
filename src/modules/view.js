const listFeed = [];
const addFeed = (feeds, title, description) => {
  const listGroup = feeds.querySelector('.list-group');
  const li = document.createElement('li');
  li.classList.add('list-group-item', 'border-0', 'border-end-0');
  const h3 = document.createElement('h3');
  h3.classList.add('h6', 'm-0');
  h3.textContent = title;
  li.append(h3);
  const p = document.createElement('p');
  p.classList.add('m-0', 'small', 'text-black-50');
  p.textContent = description;
  li.append(p);
  listFeed.push(li);
  listFeed.forEach((item) => listGroup.prepend(item));
};

const showFeed = (elements, title, description) => {
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

const showModal = (e, post) => {
  const modalTitle = document.querySelector('.modal-title');
  const modalBody = document.querySelector('.modal-body');
  const modalFooter = document.querySelector('.modal-footer');
  modalTitle.textContent = post.postTitle;
  modalBody.textContent = post.postDescription;
  modalFooter.querySelector('a').href = post.postLink;
  const a = e.target.parentNode.querySelector('a');
  a.classList.remove('fw-bold');
  a.classList.add('fw-normal');
};

const addPosts = (elements, i18n, feedPosts, feedDescription) => {
  const {
    feedback, input, posts,
  } = elements;
  let ul = posts.querySelector(`[data-description = '${feedDescription}']`);
  if (!ul) {
    ul = document.createElement('ul');
    ul.classList.add('list-group', 'border-0', 'rounded-0');
    ul.setAttribute('data-description', feedDescription);
    posts.append(ul);
  }

  const oldPosts = Array.from(ul.querySelectorAll('li'));
  const oldTitles = oldPosts.map((post) => post.querySelector('a').textContent.trim());
  feedPosts.forEach((post) => {
    const { postTitle } = post;
    if (!oldTitles.includes(postTitle)) {
      const { postLink } = post;
      const li = document.createElement('li');
      li.classList.add('list-group-item', 'border-0', 'border-end-0', 'd-flex', 'justify-content-between', 'align-items-start');
      li.innerHTML = `<a href= ${postLink}
    class="fw-bold" data-id="2" target="_blank" rel="noopener noreferrer">
    ${postTitle}</a>
    <button type="button" class="btn btn-outline-primary btn-sm" 
    data-id="2" data-bs-toggle="modal" data-bs-target="#modal">Просмотр</button>`;
      li.querySelector('button').addEventListener('click', (e) => showModal(e, post));
      ul.prepend(li);
    }
  });
  feedback.textContent = i18n.t('rssLoaded');
  feedback.classList.remove('text-danger');
  feedback.classList.add('text-success');
  input.classList.remove('is-invalid');
};

let counter = 0;

const initPosts = (elements) => {
  if (counter > 0) { return; }
  const { posts } = elements;
  posts.innerHTML = `<div class="card border-0">
  <div class="card-body">
    <h2 class="card-title h4">Посты</h2>
  </div>
  </div>`;
  counter = 1;
};

const updatePosts = (elements, i18n, value) => {
  const { feedDescription, posts } = value;
  addPosts(elements, i18n, posts, feedDescription);
};

const handleNotValidUrl = (elements, i18n, errValue) => {
  const { feedback, input } = elements;
  feedback.textContent = i18n.t(`errors.validation.${errValue}`);
  feedback.classList.add('text-danger');
  feedback.classList.remove('text-success');
  input.classList.add('is-invalid');
};

const handleValidUrl = (elements, i18n, value) => {
  const lastValue = value.at(-1);
  const { feedTitle, feedDescription, feedPosts } = lastValue;
  showFeed(elements, feedTitle, feedDescription);
  initPosts(elements);
  addPosts(elements, i18n, feedPosts, feedDescription);
  setTimeout(() => elements.form.reset(), 100);
};

const render = (elements, i18n) => (path, value) => {
  switch (path) {
    case 'error':
      handleNotValidUrl(elements, i18n, value);
      elements.input.removeAttribute('disabled');
      break;
    case 'loadProcess.state':
      switch (value) {
        case 'readyToLoad':
        case 'loadInProcess':
          // elements.input.setAttribute('disabled', '');
          break;
        case 'successLoad':
          elements.input.removeAttribute('disabled');
          break;
        default: break;
      }
      break;
    case 'loadedFeeds':
      handleValidUrl(elements, i18n, value); break;
    case 'loadedPosts': updatePosts(elements, i18n, value); break;
    default: break;
  }
};

export default render;
