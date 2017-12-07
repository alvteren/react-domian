import "whatwg-fetch";
const baseURL =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_API_BASE_URL
    : process.env.REACT_APP_API_TEST_BASE_URL;

export const fetchWishObjects = async ({ wishId }) => {
  const response = await fetch(baseURL + "/v1/wish/?wishId=" + wishId, {
    credentials: "include"
  });
  return response.json();
};

export const addToWish = async ({ wishId, objectsId }) => {
  const response = await fetch(baseURL + "/v1/wish/", {
    method: "POST",
    credentials: "include",
    mode: "cors",
    body: JSON.stringify({
      wishId,
      objectsId
    })
  });
  return response.json();
};

export const removeFromWish = async ({ wishId, objectsId }) => {
  const response = await fetch(baseURL + "/v1/wish/", {
    method: "DELETE",
    credentials: "include",
    mode: "cors",
    body: JSON.stringify({
      wishId,
      objectsId
    })
  });
  return response.json();
};
