const baseURL = process.env.REACT_APP_API_BASE_URL;
const lastApiVersion = process.env.REACT_APP_LAST_API_VERSION_CRM;

export const addNewReminder = async props => {
  const { entityId, elementId, reminderId, reminder } = props;
  const response = await fetch(`${baseURL}/${lastApiVersion}/crm/reminder/`, {
    method: "POST",
    credentials: "include",
    mode: "cors",
    body: reminderId ?
      JSON.stringify({ entityId, elementId, reminderId, reminder }) :
      JSON.stringify({ entityId, elementId,  reminder })
  });
  return response.json();
};

export const removeReminder = async props => {
  const { entityId, elementId, reminderId } = props;
  const response = await fetch(`${baseURL}/${lastApiVersion}/crm/reminder/`, {
    method: "DELETE",
    credentials: "include",
    mode: "cors",
    body: JSON.stringify({ entityId, elementId, reminderId })
  });
  return response.json();
};