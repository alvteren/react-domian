import "whatwg-fetch";
import objectToQueryString from "./objectToQuery";

const baseURL = process.env.REACT_APP_API_BASE_URL;

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
  const { wishId, entityId, elementsId } = params;
  const response = await fetch(baseURL + "/v1/wish/", {
    method: "POST",
    credentials: "include",
    mode: "cors",
    body: JSON.stringify({ wishId, entityId, elementsId })
  });
  return response.json();
};

export const removeFromWish = async params => {
  const { wishId, entityId, elementsId } = params;
  const response = await fetch(baseURL + "/v1/wish/", {
    method: "DELETE",
    credentials: "include",
    mode: "cors",
    body: JSON.stringify({ wishId, entityId, elementsId })
  });
  return response.json();
};
