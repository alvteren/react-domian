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

export const authorize = async props => {
  const { login, password } = props;

  const params = {
    method: "POST",
    credentials: "include",
    mode: "cors",
    body: JSON.stringify({ login, password, action: "auth" }),
    headers: new Headers({
      "Content-Type": "application/json"
    })
  };
  const response = await fetch(baseURL + "/v1/auth/", params);
  return response.json();
};
export const getCurrentUser = async () => {
  const response = await fetch(baseURL + `/v1/auth/`, {
    credentials: "include",
    mode: "cors"
  });
  return response.json();
};
