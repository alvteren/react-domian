const baseURL = process.env.REACT_APP_API_BASE_URL;
const lastApiVersion = process.env.REACT_APP_LAST_API_VERSION_CRM;

export const addNewReminder = async props => {
  const { entityId, elementId, reminder } = props;
  debugger;
  const response = await fetch(`${baseURL}/${lastApiVersion}/crm/reminder/`, {
    method: "POST",
    credentials: "include",
    mode: "cors",
    body: JSON.stringify({ entityId, elementId, reminder })
  });
  return response.json();
};

export const updateReminder = async props => {
  const { entityId, elementId, reminderId, reminder } = props;
  const response = await fetch(`${baseURL}/${lastApiVersion}/crm/reminder/`, {
    method: "PUT",
    credentials: "include",
    mode: "cors",
    body: JSON.stringify({ entityId, elementId, reminderId, reminder })
  });
  return response.json();
};