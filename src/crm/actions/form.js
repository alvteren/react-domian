import { uploadFile } from "../../api/form";
export const saveToStore = props => async dispatch => {
  const { id, elementId, name, value } = props;
  dispatch({
    type: "FORM_SAVE_TO_STORE",
    payload: { id, elementId, name, value }
  });
};
export const saveFile = props => async dispatch => {
  const { id, elementId, name, file } = props;
  const result = await uploadFile(file);
  const { preview } = file;
  const value = preview ? { ...result, src: preview } : result;
  dispatch({
    type: "FORM_SAVE_FILE",
    payload: { id, elementId, name, value }
  });
};
