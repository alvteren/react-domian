import { get } from "lodash";

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
  reminder: {
    id: "reminder",
    label: "Напомнить",
    type: "switch",
    required: false
  },
  reminderInterval: {
    id: "reminderInterval",
    label: "Дата напоминания",
    type: "date",
    required: true,
    depended: "reminder"
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
    reminder: false,
    reminderInterval: ""
  }
};

const initialState = {
  fields,
  values
};

export default function reducer(state = initialState, { type, payload }) {
  if (type === "TABLE_FETCH_DATA_SUCCESS") {
    const items = get(payload, "data.items", null);
    const values = {};
    if (items) {
      const values = {};
      Object.keys(items).forEach((key) => {
        if (items.key.reminders) {
          console.log("REM");
        }
      });
    }
  }
  return state;
}