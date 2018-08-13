const baseURL = process.env.REACT_APP_API_BASE_URL;
const lastApiVersion = process.env.REACT_APP_LAST_API_VERSION_CRM;

export const saveShow = async props => {
  const { entityId, elementId, showId, show } = props;

  const response = await fetch(`${baseURL}/${lastApiVersion}/crm/${entityId}/show/`, {
    method: "POST",
    credentials: "include",
    mode: "cors",
    body: showId ?
      JSON.stringify({ entityId, elementId, showId, ...show }) :
      JSON.stringify({ entityId, elementId,  ...show })
  });
  return response.json();
};
