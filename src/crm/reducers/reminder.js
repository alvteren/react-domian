import { get } from "lodash";
import formData from "./formData";
import {entities} from "../../constants";

export const fields = {
  theme: {
    id: "theme",
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
  remind: {
    id: "remind",
    label: "Напомнить",
    type: "switch",
    required: false
  },
  reminderInterval: {
    id: "reminderInterval",
    label: "Дата напоминания",
    type: "date",
    required: true,
    depended: "remind",
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

const values = {
  // default props
  0: {
    theme: "",
    type: "",
    description: "",
    date: "",
    remind: false,
    reminderInterval: ""
  }
};

const initialState = {
  fields,
  values
};

export default function reducer(state = initialState, { type, payload }) {
  const entityId = get(payload, "entityId", null);
  if (entityId === entities.reminder) {
    const newFormState = formData(state, { type, payload });
    if (newFormState) {
      return {
        ...state,
        ...newFormState
      };
    }
  }
  if (type === "TABLE_FETCH_DATA_SUCCESS") {
    // debugger;
    const items = get(payload, "data", null);
    const values = {};
    if (items) {
      Object.keys(items).forEach((key) => {
        if (items[key].reminders) {
          for (let reminderId in items[key].reminders) {
            values[reminderId] = items[key].reminders[reminderId];
            values[reminderId].can = { edit: true };
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
  return state;
}