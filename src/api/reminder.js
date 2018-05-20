const baseURL = process.env.REACT_APP_API_BASE_URL;

export const addNewReminder = async props => {
  const { entityId, elementId, reminder } = props;
  const response = await fetch(`${baseURL}/v1/${entityId}/${elementId}/reminder/`, {
    method: "POST",
    credentials: "include",
    mode: "cors",
    body: JSON.stringify(reminder)
  });
  return response.json();
};

export const updateReminder = async props => {
  const { entityId, elementId, reminderId, reminder } = props;
  const response = await fetch(`${baseURL}/v1/${entityId}/${elementId}/reminder/${reminderId}`, {
    method: "PUT",
    credentials: "include",
    mode: "cors",
    body: JSON.stringify(reminder)
  });
  return response.json();
};