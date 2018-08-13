import React, { Fragment } from "react";
import { connect } from "react-redux";

import ModalSearch from "./ModalSearch";

import { Grid, IconButton } from "material-ui";
import { TextField } from "material-ui";
import { ListItem, ListItemText } from "material-ui/List";

import ModeEditIcon from "material-ui-icons/ModeEdit";
import Done from "material-ui-icons/Done";

import { withStyles } from "material-ui/styles";
import { stylesMUI as stylesFieldMUI } from "../../Field";

import { openSearch } from "../../../actions/form";
import { omit, get } from "lodash";
import stylesField from "../Field.module.css";
import CloseIcon from "material-ui-icons/Close";

export const entitySearch = "street";

class Street extends React.PureComponent {
  onFocus = () => {
    this.props.openSearch();
  };

  render() {
    const { id, value, field, onChange, classes, open } = this.props;

    const clearValue = () => {
      onChange({ name: id, value: "" });
    };

    return (
      <Grid item xs={12} sm={6} className={classes.valueWrapper}>
        <Fragment>
          <TextField
            className={classes.formControl}
            fullWidth
            name={field.id}
            label={field.label}
            value={value || ""}
            onFocus={this.onFocus}
            helperText={field.hint}
          />
          {value && (
            <IconButton
              onClick={clearValue}
              className={stylesField.buttonClear}
              color="primary"
            >
              <CloseIcon />
            </IconButton>
          )}
          {open && <ModalSearch onChangeValue={onChange} {...this.props} />}
        </Fragment>
      </Grid>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { open } = state.crm.form.search[entitySearch];

  return { open };
};
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    openSearch: () => {
      dispatch(openSearch({ entitySearch }));
    }
  };
};

const stylesMUI = omit(stylesFieldMUI, ["formControlWithButton", "iconButton"]);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Street);
