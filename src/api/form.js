import "whatwg-fetch";
import objectToQuery from "./objectToQuery";

const baseURL = process.env.REACT_APP_API_BASE_URL;

export const uploadFile = async file => {
  const formData = new FormData();
  formData.append("file", file);
  const params = {
    method: "POST",
    credentials: "include",
    mode: "cors",
    body: formData
  };

  const response = await fetch(baseURL + "/v1/file/", params);
  return response.json();
};

export const downloadFile = async fileId => {
  const response = await fetch(baseURL + `/v1/file/?fileId=${fileId}`);
  return response.json();
};

export const deleteFile = async fileId => {
  const params = {
    method: "POST",
    credentials: "include",
    mode: "cors",
    body: JSON.stringify({ fileId })
  };

  const response = await fetch(baseURL + "/v1/file/", params);
  return response.json();
};

export const fetchSearchResult = async props => {
  const params = objectToQuery(props);
  const response = await fetch(baseURL + "/v1/search/?" + params, {
    credentials: "include"
  });

  return response.json();
};
export const saveSelectedValue = async props => {
  const params = {
    method: "POST",
    credentials: "include",
    mode: "cors",
    body: JSON.stringify(props)
  };
  const response = await fetch(baseURL + "/v1/search/", params);

  return response.json();
};
