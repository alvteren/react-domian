export default {
  imgBaseUrl:
    process.env.NODE_ENV === "production"
      ? process.env.REACT_APP_IMG_BASE_URL
      : process.env.REACT_APP_IMG_TEST_BASE_URL,
  apiBaseUrl:
    process.env.NODE_ENV === "production"
      ? process.env.REACT_APP_API_BASE_URL
      : process.env.REACT_APP_API_TEST_BASE_URL
};
