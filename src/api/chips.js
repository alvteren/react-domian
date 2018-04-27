import "whatwg-fetch";
import objectToQuery from "./objectToQuery";

const baseURL = process.env.REACT_APP_API_BASE_URL;

export const fetchChips = async props => {
  const params = objectToQuery(props);
  const response = await fetch(baseURL + "/v1/chips/?" + params, {
    credentials: "include"
  });

  return response.json();
};
