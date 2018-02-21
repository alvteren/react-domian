import { fetchUser as fetchUserTelegramApi } from "../../api/telegram";

export const fetchUserTelegram = telegramUserID => async dispatch => {
  try {
    dispatch({ type: "TELEGRAM_FETCH_USER_STARTED", payload: telegramUserID });

    const data = await fetchUserTelegramApi(telegramUserID);
    dispatch({
      type: "TELEGRAM_FETCH_USER_SUCCESS",
      payload: data
    });
  } catch (err) {
    dispatch({ type: "TELEGRAM_FETCH_USER_ERROR", payload: err, error: true });
  }
};
