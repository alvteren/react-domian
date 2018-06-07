import React, { Fragment } from "react";
import { connect } from "react-redux";

import ModalSearch from "./ModalSearch";

import { Grid, IconButton } from "material-ui";
import Input, { InputLabel } from "material-ui/Input";
import { FormControl, FormHelperText } from "material-ui/Form";
import { ListItem, ListItemText } from "material-ui/List";

import ModeEditIcon from "material-ui-icons/ModeEdit";
import Done from "material-ui-icons/Done";

import { withStyles } from "material-ui/styles";
import { stylesMUI } from "../../Field";

import { openSearch } from "../../actions/form";

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
      open
    } = this.props;

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
            <FormControl fullWidth className={classes.formControl} key={id}>
              <InputLabel htmlFor={id} required={field.required}>
                {field.label}
              </InputLabel>
              <Input value={value} name={id} onFocus={this.onFocus} />
              {field.hint && <FormHelperText>{field.hint}</FormHelperText>}
            </FormControl>
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(stylesMUI)(Street));
