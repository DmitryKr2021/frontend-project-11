const parse = (data) => {
  const result = new DOMParser().parseFromString(data, 'text/xml');
  const parseError = result.querySelector('parsererror');
  if (parseError) {
    const error = new Error(parseError.textContent);
    error.isParsingError = true;
    error.data = data;
    throw parseError;
  }
  const arr = Array.from(result.getElementsByTagName('item'));
  const posts = {
    posts: arr.map((post) => ({
      link: post.querySelector('link').textContent,
      title: post.querySelector('title').textContent,
      description: post.querySelector('description').textContent,
    })),
  };
  const channel = result.querySelector('channel');
  const title = channel.querySelector('title').textContent;
  const description = channel.querySelector('description').textContent;
  const feed = {
    title,
    description,
    posts: posts.posts,
  };
  return feed;
};
export default parse;
