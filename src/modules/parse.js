const parse = (data, format, content) => {
  const result = new DOMParser().parseFromString(data, format);
  if (result.getElementsByTagName('parsererror')[0]) { return false; }
  const arr = Array.from(result.getElementsByTagName('item'));
  const posts = {
    posts: arr.map((post) => ({
      postLink: post.querySelector('link').textContent,
      postTitle: post.querySelector('title').textContent,
      postDescription: post.querySelector('description').textContent,
    })),
  };

  if (content === 'feed') {
    const channel = result.querySelector('channel');
    const feedTitle = channel.querySelector('title').textContent;
    const feedDescription = channel.querySelector('description').textContent;
    const feed = {
      feedTitle,
      feedDescription,
      feedPosts: posts.posts,
    };
    return feed;
  }
  return posts;
};
export default parse;
