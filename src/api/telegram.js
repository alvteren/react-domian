import "whatwg-fetch";
import objectToQuery from "./objectToQuery";

const baseURL =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_API_BASE_URL
    : process.env.REACT_APP_API_TEST_BASE_URL;

export const fetchUser = async telegramUserId => {
  const params = objectToQuery({ id: telegramUserId });
  const response = await fetch(baseURL + "/v1/telegram/?" + params, {
    // credentials: "include"
  });

  return response.json();
};
