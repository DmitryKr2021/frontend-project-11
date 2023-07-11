import * as yup from 'yup';

const validate = (state) => {
  const { loadedUrls } = state;
  const schema = yup.object({
    url: yup.string().url().notOneOf(loadedUrls),
  });
  return (schema.validate(state));
};
export default validate;
