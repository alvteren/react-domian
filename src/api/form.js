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

export const savePropToServer = async props => {
  const { entityId, elementId } = props;
  const formData = {
    id: elementId,
    [props.name]: props.value
  };
  const params = {
    method: "PUT",
    credentials: "include",
    mode: "cors",
    body: JSON.stringify(formData)
  };

  const response = await fetch(baseURL + `/v1/${entityId}/`, params);
  return response.json();
};

export const saveFormToServer = async props => {
  const { id: entityId, formData } = props;
  const params = {
    method: "POST",
    credentials: "include",
    mode: "cors",
    body: JSON.stringify(formData)
  };
  const response = await fetch(baseURL + `/v1/${entityId}/`, params);
  return response.json();
};