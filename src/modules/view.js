const addFeed = (feeds, list) => {
  const listGroup = feeds.querySelector('.list-group');
  list.forEach((item) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'border-0', 'border-end-0');
    const h3 = document.createElement('h3');
    h3.classList.add('h6', 'm-0');
    h3.textContent = item.title;
    li.append(h3);
    const p = document.createElement('p');
    p.classList.add('m-0', 'small', 'text-black-50');
    p.textContent = item.description;
    li.append(p);
    listGroup.prepend(li);
  });
};

const renderFeed = (elements, list) => {
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
  modalTitle.textContent = post.title;
  modalBody.textContent = post.description;
  modalFooter.querySelector('a').href = post.link;
  const a = e.target.parentNode.querySelector('a');
  a.classList.remove('fw-bold');
  a.classList.add('fw-normal');
};

const addPosts = (elements, i18n, loaded, update) => {
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
    const { feedback, input, postsHtml } = elements;
    loaded.forEach((item) => {
      const { posts, description } = item;
      const ul = document.createElement('ul');
      ul.classList.add('list-group', 'border-0', 'rounded-0');
      ul.setAttribute('data-description', description);
      postsHtml.append(ul);
      posts.forEach((post) => {
        const { title, link } = post;
        createList(post, link, title, ul);
      });
    });
    feedback.textContent = i18n.t('rssLoaded');
    feedback.classList.remove('text-danger');
    feedback.classList.add('text-success');
    input.classList.remove('is-invalid');
  } else {
    const { postsHtml } = elements;
    const ul = postsHtml.querySelector(`[data-description = '${loaded[0]}']`);
    const oldPosts = Array.from(ul.querySelectorAll('li'));
    const oldTitles = oldPosts.map((post) => post.querySelector('a').textContent.trim());
    const loadedPosts = loaded.slice(1);
    loadedPosts.forEach((post) => {
      const { title, link } = post;
      if (!oldTitles.includes(title)) {
        createList(post, link, title, ul);
      }
    });
  }
};

const renderPosts = (elements) => {
  const { postsHtml } = elements;
  postsHtml.innerHTML = `<div class="card border-0">
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
  renderFeed(elements, value);
  renderPosts(elements);
  addPosts(elements, i18n, value, false);
  elements.form.reset();
};

const render = (elements, i18n) => (path, value) => {
  switch (path) {
    case 'form.error':
    case 'load.error':
    case 'parse.error':
      handleError(elements, i18n, path, value);
      break;
    case 'load.status':
      switch (value) {
        case 'loadInProcess':
          elements.input.setAttribute('disabled', '');
          break;
        case 'successLoad':
          elements.input.removeAttribute('disabled');
          break;
        default: break;
      }
      break;
    case 'feeds':
      handleValidUrl(elements, i18n, value); break;
    case 'posts': addPosts(elements, i18n, value, true); break;
    default: break;
  }
};

export default render;
