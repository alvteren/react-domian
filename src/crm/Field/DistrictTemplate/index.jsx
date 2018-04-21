import React, { Fragment } from "react";
import { connect } from "react-redux";

import { FormControl, FormHelperText } from "material-ui/Form";
import Chip from "material-ui/Chip";
import Grid from "material-ui/Grid";
import Typography from "material-ui/Typography";

import IconButton from "material-ui/IconButton";
import Done from "material-ui-icons/Done";
import AddIcon from "material-ui-icons/Add";

import List, { ListItem, ListItemText, ListSubheader } from "material-ui/List";

import DistrictSelect from "./DistrictSelect";

import styles from "./index.module.css";

class District extends React.PureComponent {
  state = {
    open: false
  };

  onChangeValue = value => {
    const { onChange, id } = this.props;
    onChange({ target: { name: id, value: value } });
  };
  handleDelete = fieldValue => () => {
    const { field, value } = fieldValue;
  };
  onOpenDialog = () => {
    this.setState({ open: true });
  };
  onCloseDialog = () => {
    this.setState({ open: false });
  };

  render() {
    const {
      id,
      value,
      field,
      onChange,
      onSave,
      formControl,
      canEdit
    } = this.props;
    const { needSave } = this.props.state;
    return (
      <Fragment>
        <Grid item xs={12} sm={12}>
          <div className={styles.fieldWrapper}>
            <div>
              <Typography variant="subheading" gutterBottom={true}>
                {field.label}
              </Typography>
              <div className={styles.chips}>
                <Chip
                  label="Район 1"
                  onDelete={this.handleDelete({
                    field: "uf_crm_distruct или uf_crm_subdistruct",
                    value: "value1"
                  })}
                  className={styles.chip}
                />
                <Chip
                  label="Район 2"
                  onDelete={this.handleDelete({
                    field: "uf_crm_distruct или uf_crm_subdistruct",
                    value: "value2"
                  })}
                  className={styles.chip}
                />
                {canEdit && (
                  <IconButton color="primary" onClick={this.onOpenDialog}>
                    <AddIcon />
                  </IconButton>
                )}
              </div>
            </div>
          </div>
        </Grid>
        {this.state.open && (
          <DistrictSelect {...this.props} onCloseDialog={this.onCloseDialog} />
        )}
      </Fragment>
    );
  }
}
const mapStateToProps = (state, ownProps) => {
  console.log(ownProps);
  const { objectId } = ownProps;
  const { can } = state.crm.leads.values[objectId];
  console.log(can);
  const { edit: canEdit = false } = can;
  return { canEdit };
};
export default connect(mapStateToProps)(District);
