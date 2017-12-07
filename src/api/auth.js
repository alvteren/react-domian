import "whatwg-fetch";
const baseURL =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_API_BASE_URL
    : process.env.REACT_APP_API_TEST_BASE_URL;

export const authorizeBy = async userId => {
  const response = await fetch(baseURL + "/v1/auth/?userId=" + userId, {
    credentials: "include",
    mode: "cors"
  });
  return response.json();
};

export const authorize = async ({ login, password }) => {
  const response = await fetch(baseURL + `/v1/auth/?${login}&${password}`, {
    credentials: "include",
    mode: "cors"
  });
  return response.json();
};
