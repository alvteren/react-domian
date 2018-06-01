import { get, toArray } from "lodash";
import formData from "./formData";
import validateData from "./validate";
import { ENTITIES } from "../../constants";
import * as reminderActions from "../actions/reminder";
import { getTomorrowDate, convertDateForMui } from "../../util/dateConverter";

export const fields = {
  subject: {
    id: "subject",
    label: "Тема",
    type: "text",
    required: true,
  },
  type: {
    id: "type",
    label: "Тип",
    type: "select",
    required: true,
    items: {
      call: {
        label: "Звонок",
        value: "call"
      },
      meeting: {
        label: "Встреча",
        value: "meeting"
      }
    }
  },
  date: {
    id: "date",
    label: "Когда",
    type: "date",
    required: true
  },
  reminder: {
    id: "reminder",
    label: "Напомнить",
    type: "switch",
    required: false
  },
  remindInterval: {
    id: "remindInterval",
    label: "Дата напоминания",
    type: "date",
    required: true,
    depended: "reminder",
    dependedValue: true,
    dependedAction: "disabled"
  },
  description: {
    id: "description",
    label: "Описание",
    type: "textarea",
    required: false
  }
};

const dateFields = [];
toArray(fields).forEach((item, index) => {
  if (item.type === "date") dateFields.push(item.id);
});

const defaultValues = {
  subject: "",
  type: "",
  description: "",
  date: getTomorrowDate(),
  reminder: false,
  remindInterval: getTomorrowDate()
};

export const formFields = (() => {
  const form = {};
  for (let key in fields) {
    form[key] = true;
  }
  return form;
})();

const values = {
  // default props for new instance
  0: defaultValues
};

const initialState = {
  fields,
  values
};

export default function reducer(state = initialState, { type, payload }) {
  const entityId = get(payload, "entityId", null);
  if (entityId === ENTITIES.reminder) {
    const newFormState = formData(state, { type, payload });
    const newValidateData = validateData(state, { type, payload });
    if (newFormState) {
      return {
        ...state,
        ...newFormState
      };
    }

    if (newValidateData) {
      return {
        ...state,
        ...newValidateData
      }
    }
  }

  if (type === "TABLE_FETCH_DATA_SUCCESS") {
    const items = get(payload, "data", {});
    const values = {};

    if (items) {
      Object.keys(items).forEach((key) => {
        if (items[key].reminders) {
          for (let reminderId in items[key].reminders) {
            values[reminderId] = items[key].reminders[reminderId];
            values[reminderId].can = { edit: true };

            /* Date fields convert for Mui */
            dateFields.forEach((field) => {
              values[reminderId][field] = items[key].reminders[reminderId][field] ?
                convertDateForMui(items[key].reminders[reminderId][field]) :
                getTomorrowDate();
            });
          }
        }
      });
    }
    return {
      ...state,
      values: {
        ...state.values,
        ...values
      }
    }
  }

  if (type === reminderActions.REMINDER_ADD_START) {

  }

  if (type === reminderActions.REMINDER_ADD_SUCCESS) {
    debugger;
    return {
      ...state,
      values: {
        ...state.values,
        [payload.id]: payload.reminder
      }
    }
  }

  if (type === reminderActions.REMINDER_NEW_SET_DEFAULT) {
    return {
      ...state,
      values: {
        ...state.values,
        0: defaultValues
      }
    }
  }

  if (type === reminderActions.REMINDER_SET_EDITED_PROP) {
    const { reminderId } = payload;
    return {
      ...state,
      values: {
        ...state.values,
        [reminderId]: {
          ...state.values[reminderId],
          edited: true
        }
      }
    }
  }

  return state;
}