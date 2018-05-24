import { addNewReminder as addNewReminderApi } from "../../api/reminder";
import { updateReminder as updateReminderApi } from "../../api/reminder";

export const addNewReminder = props => async dispatch => {
  const { entityId, elementId, reminder } = props;

  /* Below we add secs and timezone parts to date fields */
  const formData = Object.assign({}, reminder); // For operate on copied reminder and return origin as payload if save will be succeed
  formData.date = (new Date(formData.date)).toISOString();
  formData.reminder ?
    formData.reminderInterval = (new Date(formData.date)).toISOString() :
    formData.reminderInterval = "";
  try {
    const data = await addNewReminderApi({ entityId, elementId, reminder: formData });
    // const data = { success: true, id: 9999 }; //for test
    dispatch({
      type: "REMINDER_ADD_SUCCESS",
      payload: { entityId, ...data, elementId, reminder }
    });
    dispatch(setNewReminderToDefault());
  } catch (err) {
    console.warn("ERR", err);
    dispatch({ type: "REMINDER_ADD_ERROR", payload: err, error: true });
  }

};

export const updateReminder = props => async dispatch => {
  const { entityId, elementId, reminderId, reminder } = props;
  try {
    const data = await updateReminderApi({ entityId, elementId, reminderId, reminder });
    // const data = {}; for test
    dispatch({
      type: "REMINDER_UPDATE_SUCCESS",
      payload: { entityId, elementId, reminderId, reminder, ...data }
    });
  } catch (err) {
    console.warn("ERR", err);
    dispatch({ type: "REMINDER_UPDATE_ERROR", payload: err, error: true });
  }
};

export const setNewReminderToDefault = props => dispatch => {
  dispatch({
    type: "REMINDER_NEW_SET_DEFAULT",
    payload: {}
  })
};

export const setEditedProp = props => dispatch => {
  const { reminderId } = props;
  dispatch({
    type: "REMINDER_SET_EDITED_PROP",
    payload: { reminderId }
  })
};
