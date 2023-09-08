const addFeed = (feeds, list) => {
  const listGroup = feeds.querySelector('.list-group');
  list.forEach((item) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'border-0', 'border-end-0');
    const h3 = document.createElement('h3');
    h3.classList.add('h6', 'm-0');
    h3.textContent = item.feedTitle;
    li.append(h3);
    const p = document.createElement('p');
    p.classList.add('m-0', 'small', 'text-black-50');
    p.textContent = item.feedDescription;
    li.append(p);
    listGroup.prepend(li);
  });
};

const showFeed = (elements, list) => {
  const { feeds } = elements;
  feeds.innerHTML = `<div class="card border-0">
  <div class="card-body">
    <h2 class="card-title h4">Фиды</h2>
  </div>
  <ul class="list-group border-0 rounded-0">
  </ul>
  </div>`;
  addFeed(feeds, list);
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

const addPosts = (elements, i18n, feeds, update) => {
  const createList = (post, postLink, postTitle, ul) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'border-0', 'border-end-0', 'd-flex', 'justify-content-between', 'align-items-start');
    li.innerHTML = `<a href= ${postLink}
    class="fw-bold" data-id="2" target="_blank" rel="noopener noreferrer">
    ${postTitle}</a>
    <button type="button" class="btn btn-outline-primary btn-sm" 
    data-id="2" data-bs-toggle="modal" data-bs-target="#modal">Просмотр</button>`;
    li.querySelector('button').addEventListener('click', (e) => showModal(e, post));
    ul.prepend(li);
  };

  if (!update) {
    const { feedback, input, posts } = elements;
    feeds.forEach((item) => {
      const { feedPosts, feedDescription } = item;
      const ul = document.createElement('ul');
      ul.classList.add('list-group', 'border-0', 'rounded-0');
      ul.setAttribute('data-description', feedDescription);
      posts.append(ul);
      feedPosts.forEach((post) => {
        const { postTitle, postLink } = post;
        createList(post, postLink, postTitle, ul);
      });
    });
    feedback.textContent = i18n.t('rssLoaded');
    feedback.classList.remove('text-danger');
    feedback.classList.add('text-success');
    input.classList.remove('is-invalid');
  } else {
    const { posts } = elements;
    const ul = posts.querySelector(`[data-description = '${feeds.feedDescription}']`);
    const oldPosts = Array.from(ul.querySelectorAll('li'));
    const oldTitles = oldPosts.map((post) => post.querySelector('a').textContent.trim());
    const loadedPosts = Object.values(feeds).slice(0, -1);
    loadedPosts.forEach((post) => {
      const { postTitle, postLink } = post;
      if (!oldTitles.includes(postTitle)) {
        createList(post, postLink, postTitle, ul);
      }
    });
  }
};

const showPosts = (elements) => {
  const { posts } = elements;
  posts.innerHTML = `<div class="card border-0">
  <div class="card-body">
    <h2 class="card-title h4">Посты</h2>
  </div>
  </div>`;
};

const handleError = (elements, i18n, errorType, errValue) => {
  const { feedback, input } = elements;
  input.removeAttribute('disabled');
  feedback.textContent = i18n.t(`errors.${errorType}.${errValue}`);
  feedback.classList.add('text-danger');
  feedback.classList.remove('text-success');
  input.classList.add('is-invalid');
};

const handleValidUrl = (elements, i18n, value) => {
  showFeed(elements, value);
  showPosts(elements);
  addPosts(elements, i18n, value, false);
  elements.form.reset();
};

const render = (elements, i18n) => (path, value) => {
  switch (path) {
    case 'form.error':
    case 'load.error':
      handleError(elements, i18n, path, value);
      break;
    case 'load.state':
      switch (value) {
        case 'readyToLoad':
        case 'loadInProcess':
          elements.input.setAttribute('disabled', '');
          break;
        case 'successLoad':
          elements.input.removeAttribute('disabled');
          break;
        default: break;
      }
      break;
    case 'load.feeds':
      handleValidUrl(elements, i18n, value); break;
    case 'load.posts': addPosts(elements, i18n, value, true); break;
    default: break;
  }
};

export default render;
