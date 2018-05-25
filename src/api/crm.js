import "whatwg-fetch";
import objectToQuery from "./objectToQuery";
import { omit, get } from "lodash";

const baseURL = process.env.REACT_APP_API_BASE_URL;
const lastApiVersion = process.env.REACT_APP_LAST_API_VERSION_CRM;

export const fetchList = async props => {
  const params = objectToQuery(omit(props, ["entityId", "version"]));
  const { entityId } = props;
  const version = get(props, "version", lastApiVersion);

  const response = await fetch(
    baseURL + `/${version}/crm/${entityId}/list/?` + params,
    {
      credentials: "include",
      mode: "cors"
    }
  );
  return response.json();
};

export const fetchDetail = async props => {
  const params = objectToQuery(omit(props, ["entityId", "version"]));
  const { entityId } = props;
  const version = get(props, "version", lastApiVersion);

  const response = await fetch(
    baseURL + `/${version}/crm/${entityId}/?` + params,
    {
      credentials: "include",
      mode: "cors"
    }
  );
  return response.json();
};

export const fetchFields = async props => {
  const { entityId } = props;
  const version = get(props, "version", lastApiVersion);

  const response = await fetch(
    baseURL + `/${version}/crm/${entityId}/fields/`,
    {
      credentials: "include",
      mode: "cors"
    }
  );
  return response.json();
};

export const fetchField = async props => {
  const params = objectToQuery(omit(props, ["entityId", "version"]));
  const { entityId } = props;
  const version = get(props, "version", lastApiVersion);

  const response = await fetch(
    baseURL + `/${version}/crm/${entityId}/field/?` + params,
    {
      credentials: "include",
      mode: "cors"
    }
  );
  return response.json();
};

export const savePropToServer = async props => {
  const { entityId, elementId } = props;
  const version = get(props, "version", lastApiVersion);

  const formData = {
    elementId,
    [props.name]: props.value
  };

  const result = await saveFormToServer({
    id: entityId,
    version,
    formData
  });

  return result;
};

export const saveFormToServer = async props => {
  const { entityId, formData } = props;
  const version = get(props, "version", lastApiVersion);

  const params = {
    method: "PUT",
    credentials: "include",
    mode: "cors",
    body: JSON.stringify(formData)
  };

  const response = await fetch(
    baseURL + `/${version}/crm/${entityId}/`,
    params
  );

  return response.json();
};

export const deleteElement = async props => {
  const { entityId, elementId } = props;
  const version = get(props, "version", lastApiVersion);

  const params = {
    method: "DELETE",
    credentials: "include",
    mode: "cors",
    body: JSON.stringify({ elementId })
  };

  const response = await fetch(
    baseURL + `/${version}/crm/${entityId}/`,
    params
  );

  return response.json();
};
