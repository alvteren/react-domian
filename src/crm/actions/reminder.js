import { addNewReminder as addNewReminderApi } from "../../api/reminder";
import { updateReminder as updateReminderApi } from "../../api/reminder";

export const addNewReminder = props => async dispatch => {
  const { entityId, elementId, reminder } = props;
  try {
    const data = await addNewReminderApi({ entityId, elementId, reminder });
    dispatch({
      type: "REMINDER_ADD_SUCCESS",
      payload: { id: entityId, ...data }
    });
  } catch (err) {

  }

};

export const updateReminder = props => async dispatch => {
  const { entityId, elementId, reminderId, reminder } = props;
  try {
    const data = await updateReminderApi({ entityId, elementId, reminderId, reminder });
    dispatch({
      type: "REMINDER_UPDATE_SUCCESS",
      payload: { id: entityId, ...data }
    });
  } catch (err) {

  }
};

export const setNewReminderToDefault = props => dispatch => {
  dispatch({
    type: "REMINDER_NEW_SET_DEFAULT",
    payload: {}
  })
};