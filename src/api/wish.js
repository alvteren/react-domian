import "whatwg-fetch";
import objectToQueryString from "./objectToQuery";
const baseURL =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_API_BASE_URL
    : process.env.REACT_APP_API_TEST_BASE_URL;

export const fetchWish = async params => {
  const { wishId, entityId } = params;
  const response = await fetch(
    baseURL + "/v1/wish/?" + objectToQueryString({ wishId, entityId }),
    {
      credentials: "include"
    }
  );
  return response.json();
};

export const addToWish = async params => {
  const { wishId, entityId, objectsId } = params;
  const response = await fetch(baseURL + "/v1/wish/", {
    method: "POST",
    credentials: "include",
    mode: "cors",
    body: JSON.stringify({ wishId, entityId, objectsId })
  });
  return response.json();
};

export const removeFromWish = async params => {
  const { wishId, entityId, objectsId } = params;
  const response = await fetch(baseURL + "/v1/wish/", {
    method: "DELETE",
    credentials: "include",
    mode: "cors",
    body: JSON.stringify({ wishId, entityId, objectsId })
  });
  return response.json();
};
