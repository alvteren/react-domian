import "whatwg-fetch";
import objectToQuery from "./objectToQuery";

const baseURL =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_API_BASE_URL
    : process.env.REACT_APP_API_TEST_BASE_URL;

export const fetchObjects = async props => {
  const params = objectToQuery(props);
  const response = await fetch(baseURL + "/v1/objects/?" + params);
  return response.json();
};

export const fetchWishObjects = async ({ id }) => {
  const response = await fetch(baseURL + "/v1/wish/?id=" + id);
  return response.json();
};

export const addToWish = async ({ id, objectId }) => {
  const response = await fetch(baseURL + "/v1/wish/", {
    method: "POST",
    body: JSON.stringify({
      id,
      objectId
    })
  });
  return response.json();
};
export const removeFromWish = async ({ id, objectId }) => {
  const response = await fetch(baseURL + "/v1/wish/", {
    method: "DELETE",
    body: JSON.stringify({
      id,
      objectId
    })
  });
  return response.json();
};
