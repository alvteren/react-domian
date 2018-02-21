import "whatwg-fetch";
import objectToQuery from "./objectToQuery";

const baseURL =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_API_BASE_URL
    : process.env.REACT_APP_API_TEST_BASE_URL;

export const fetchList = async props => {
  const params = objectToQuery(props);
  const response = await fetch(baseURL + "/v1/alliances/?" + params, {
    credentials: "include"
  });

  return response.json();
};
export const joinToAliance = async props => {
  const { id } = props;
  const params = {
    method: "POST",
    credentials: "include",
    mode: "cors",
    body: JSON.stringify({ id, action: "join" }),
    headers: new Headers({
      "Content-Type": "application/json"
    })
  };
  const response = await fetch(baseURL + "/v1/alliances/", params);

  return response.json();
};
export const getMembers = async props => {
  const params = objectToQuery(props);
  const response = await fetch(
    baseURL + "/v1/alliances/getMembers/?" + params,
    {
      credentials: "include"
    }
  );

  return response.json();
};
export const createAliance = async props => {
  const { name } = props;
  const params = {
    method: "POST",
    credentials: "include",
    mode: "cors",
    body: JSON.stringify({ name, action: "create" }),
    headers: {
      "Content-Type": "application/json"
    }
  };
  const response = await fetch(baseURL + "/v1/alliances/", params);

  return response.json();
};
