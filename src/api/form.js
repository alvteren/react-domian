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

  const response = await fetch(baseURL + "/v1/file/upload/", params);
  return response.json();
};

export const fetchSearchResult = async props => {
  const params = objectToQuery(props);
  const response = await fetch(baseURL + "/v1/location/search/?" + params, {
    credentials: "include"
  });

  return response.json();
};

export const saveToServer = async props => {
  const formData = {
    id: props.elementId,
    fields: { [props.name]: props.value }
  };
  const params = {
    method: "POST",
    credentials: "include",
    mode: "cors",
    body: JSON.stringify(formData)
  };

  const response = await fetch(baseURL + "/v1/object/", params);
  return response.json();
};
