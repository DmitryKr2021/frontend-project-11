const parse = (data) => {
  const result = new DOMParser().parseFromString(data, 'text/xml');
  if (result.getElementsByTagName('parsererror')[0]) {
    throw (result.getElementsByTagName('parsererror')[0]);
  }
  const arr = Array.from(result.getElementsByTagName('item'));
  const posts = {
    posts: arr.map((post) => ({
      postLink: post.querySelector('link').textContent,
      postTitle: post.querySelector('title').textContent,
      postDescription: post.querySelector('description').textContent,
    })),
  };
  const channel = result.querySelector('channel');
  const feedTitle = channel.querySelector('title').textContent;
  const feedDescription = channel.querySelector('description').textContent;
  const feed = {
    feedTitle,
    feedDescription,
    feedPosts: posts.posts,
  };
  return feed;
};
export default parse;
