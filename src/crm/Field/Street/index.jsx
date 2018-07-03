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

import { openSearch } from "../../actions/form";
import { omit, get } from "lodash";

export const entitySearch = "street";

class Street extends React.PureComponent {
  onFocus = () => {
    this.props.openSearch();
  };
  render() {
    const {
      id,
      value,
      field,
      onChange,
      onStartEdit,
      onSave,
      classes,
      can,
      validateError,
      open
    } = this.props;
    const hint = get(validateError, "message", get(field, "hint", ""));

    const { needSave, edit } = this.props.state;
    const { edit: canEdit = false } = can;

    const onChangeValue = value => {
      onChange({ target: { name: id, value } });
    };
    const onClick = () => {
      canEdit && onStartEdit();
    };

    return (
      <Grid item xs={12} sm={6} className={classes.valueWrapper}>
        {!edit ? (
          <div className={classes.valueWrapper} onClick={onClick}>
            <ListItem className={classes.value}>
              <ListItemText
                primary={<Fragment>{value}</Fragment>}
                secondary={field.label}
              />
            </ListItem>
            {canEdit && (
              <IconButton className={classes.buttonEdit}>
                <ModeEditIcon />
              </IconButton>
            )}
          </div>
        ) : (
          <Fragment>
            <TextField
              className={classes.formControl}
              fullWidth
              required={field.required}
              name={field.id}
              label={field.label}
              value={value || ""}
              error={Boolean(validateError)}
              onFocus={this.onFocus}
              helperText={hint}
            />
            {needSave && (
              <IconButton
                onClick={onSave(id)}
                className={classes.buttonSave}
                color="primary"
              >
                <Done />
              </IconButton>
            )}
            {open && (
              <ModalSearch onChangeValue={onChangeValue} {...this.props} />
            )}
          </Fragment>
        )}
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
)(withStyles(stylesMUI)(Street));
