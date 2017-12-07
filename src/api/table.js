import "whatwg-fetch";
import { fetchSettings } from "../api";

export const fetchTableHeaders = async props => {
  const { id } = props;
  const response = await fetchSettings({ id, code: "tableHeaders" });
  return response.json();
};
