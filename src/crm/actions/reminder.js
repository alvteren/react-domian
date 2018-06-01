import { addNewReminder as addNewReminderApi } from "../../api/reminder";
import { updateReminder as updateReminderApi } from "../../api/reminder";
import { omit } from "lodash";
import * as validateActions from "../actions/validate";

export const REMINDER_ADD_START = "REMINDER_ADD_START";
export const REMINDER_ADD_SUCCESS = "REMINDER_ADD_SUCCESS";
export const REMINDER_ADD_ERROR = "REMINDER_ADD_ERROR";

export const REMINDER_NEW_SET_DEFAULT = "REMINDER_NEW_SET_DEFAULT";
export const REMINDER_SET_EDITED_PROP = "REMINDER_SET_EDITED_PROP";

export const addNewReminder = props => async dispatch => {
  const { parent, child, reminder } = props;
  const [ parentEntityId, parentElementId ] = [ parent.entityId, parent.elementId ];
  const { entityId, elementId } = child;

  /* remove unnecessary props */
  omit(reminder, ["edited", "can"]);

  /* Below we add secs and timezone parts to date fields */
  let formData = Object.assign({}, reminder); // For operate on copied reminder and return origin as payload if save will be succeed
  formData.date = (new Date(formData.date)).toISOString();
  formData.reminder ?
    formData.reminderInterval = (new Date(formData.date)).toISOString() :
    formData.reminderInterval = "";
  try {
    dispatch({ type: validateActions.VALIDATE_FORM_SUBMIT, payload: { entityId, ...props } });
    const data = await addNewReminderApi({
      entityId: parentEntityId,
      elementId: parentElementId,
      reminder: formData
    });
    // const data = { success: true, id: 9999 }; //for test
    reminder.can = { edit: true };
    dispatch({
      type: REMINDER_ADD_SUCCESS,
      payload: {
        entityId: parentEntityId,
        elementId: parentElementId,
        reminder,
        ...data
      }
    });
    dispatch(setNewReminderToDefault({ elementId }));
  } catch (err) {
    console.warn("ERR", err);
    dispatch({ type: err.action || REMINDER_ADD_ERROR, payload: { entityId, elementId, ...err}, error: true });
  }

};

export const updateReminder = props => async dispatch => {
  const { entityId, elementId, reminderId, reminder } = props;

  /* remove unnecessary props */
  omit(reminder, ["edited", "can"]);
  try {
    const data = await updateReminderApi({ entityId, elementId, reminderId, reminder });
    // const data = {}; // for test
    reminder.can = { edit: true };
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
  const { elementId } = props;
  dispatch({
    type: REMINDER_NEW_SET_DEFAULT,
    payload: {}
  });
  dispatch({
    type: validateActions.VALIDATE_SUBMIT_CLEAR, payload: { elementId }
  })
};

export const setEditedProp = props => dispatch => {
  const { reminderId } = props;
  dispatch({
    type: REMINDER_SET_EDITED_PROP,
    payload: { reminderId }
  })
};
