import "whatwg-fetch";
import objectToQuery from "./objectToQuery";

const baseURL =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_API_BASE_URL
    : process.env.REACT_APP_API_TEST_BASE_URL;

export const fetchLeads = async props => {
  const params = objectToQuery(props);
  const response = await fetch(baseURL + "/v1/lead/list/?" + params, {
    credentials: "include",
    mode: "cors"
  });
  return response.json();
};

export const fetchLead = async props => {
  const params = objectToQuery(props);
  const response = await fetch(baseURL + "/v1/lead/?" + params, {
    credentials: "include",
    mode: "cors"
  });
  return response.json();
};

export const fetchLeadFields = async props => {
  const response = await fetch(baseURL + "/v1/lead/fields/", {
    credentials: "include",
    mode: "cors"
  });
  return response.json();
};

export const fetchLeadField = async props => {
  const params = objectToQuery(props);
  const response = await fetch(baseURL + "/v1/lead/field/?" + params, {
    credentials: "include",
    mode: "cors"
  });
  return response.json();
};
