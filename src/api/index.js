import "whatwg-fetch";
import objectToQuery from "./objectToQuery";

const baseURL = process.env.REACT_APP_API_BASE_URL;

export const fetchObjects = async props => {
  const params = objectToQuery(props);
  const response = await fetch(baseURL + "/v1/objects/?" + params, {
    credentials: "include",
    mode: "cors"
  });
  return response.json();
};

export const fetchObject = async props => {
  const params = objectToQuery(props);
  const response = await fetch(baseURL + "/v1/object/?" + params, {
    credentials: "include",
    mode: "cors"
  });
  return response.json();
};

export const fetchSettings = async props => {
  const params = objectToQuery(props);
  const response = await fetch(baseURL + "/v1/settings/?" + params, {
    credentials: "include",
    mode: "cors"
  });
  return response.json();
};
export const fetchObjectFields = async props => {
  const response = await fetch(baseURL + "/v1/object/", {
    credentials: "include",
    mode: "cors"
  });
  return response.json();
};
export const fetchObjectField = async props => {
  const params = objectToQuery(props);
  const response = await fetch(baseURL + "/v1/object/field/?" + params, {
    credentials: "include",
    mode: "cors"
  });
  return response.json();
};
