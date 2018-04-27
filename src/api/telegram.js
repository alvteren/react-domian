import "whatwg-fetch";
import objectToQuery from "./objectToQuery";

const baseURL = process.env.REACT_APP_API_BASE_URL;

export const fetchUser = async telegramUserId => {
  const params = objectToQuery({ id: telegramUserId });
  const response = await fetch(baseURL + "/v1/telegram/?" + params, {
    // credentials: "include"
  });

  return response.json();
};
