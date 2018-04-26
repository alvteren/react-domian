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
import {saveToStore} from "../../actions/form";
import { DISTRICTS, SUB_DISTRICTS } from "./districtTreeConverter";

class District extends React.PureComponent {
  state = {
    open: false,
    isTreeChanged: false,
    [DISTRICTS]: this.props[DISTRICTS] || [],
    [SUB_DISTRICTS]: this.props[SUB_DISTRICTS] || []
  };

  onChangeValue = ({ name, value }) => () => {
    debugger;
    const updated = this.state[name].filter((item) => item!== parseInt(value));
    const { onChange } = this.props;
    this.setState({[name]: updated});
    onChange(name, updated);
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
  onTreeChange = ({ name, value, add }) => {
    console.log("state", this.state[name]);
    const updated = add
      ? this.state[name].splice(0).concat([value]) // if item was added
      : this.state[name].splice(0).filter((item) => item !== parseInt(value)); // for delete item case
    console.log("updated", updated);
    this.setState({ isTreeChanged: true, [name]: updated })
  };
  onSaveToStore = () => {
    const { onChange } = this.props;
    const data = [
      {
        name: DISTRICTS,
        value:  this.state[DISTRICTS].length ? this.state[DISTRICTS] : false
      },
      {
        name: SUB_DISTRICTS,
        value: this.state[SUB_DISTRICTS]
      }
    ];
    onChange(data);
    this.setState({ open: false })
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
    const districts = this.props.uf_crm_district || [];
    // debugger;
    // This filter for non-duplicate district and sub district values output
    const subDistricts = this.props.uf_crm_district
      ? this.props.uf_crm_subdistrict.filter((item) => {
        const links = this.props.subDistrictFields.items[item].link;
        for (let i = 0; i < links.length; i++) {
          return !this.props.uf_crm_district.includes(links[i]);
        }
      })
      : this.props.uf_crm_subdistrict || [];
    return (
      <Fragment>
        <Grid item xs={12} sm={12}>
          <div className={styles.fieldWrapper}>
            <div>
              <Typography variant="subheading" gutterBottom={true}>
                {field.label}
              </Typography>
              <div className={styles.chips}>
                {
                  districts.map((district, districtIndex) => {
                    return (
                      <Chip
                        key={districtIndex}
                        label={this.props.districtFields.items[district].label}
                        onDelete={this.onChangeValue({
                          name: "uf_crm_district",
                          value: this.props.districtFields.items[district].value
                        })}
                        className={styles.chip}
                      />
                    )
                  })
                }
                {
                  subDistricts.map((subDistrict, subDistrictIndex) => {
                    return (
                      <Chip
                        key={subDistrictIndex}
                        label={this.props.subDistrictFields.items[subDistrict].label}
                        onDelete={this.onChangeValue({
                          name: "uf_crm_subdistrict",
                          value: this.props.subDistrictFields.items[subDistrict].value
                        })}
                        className={styles.chip}
                      />
                    )
                 })
                }
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
          <DistrictSelect
            {...this.props}
            onCloseDialog={this.onCloseDialog}
            onSaveToStore={this.onSaveToStore}
            onTreeChange={this.onTreeChange}
            isTreeChanged={this.state.isTreeChanged}
          />
        )}
      </Fragment>
    );
  }
}
const mapStateToProps = (state, ownProps) => {
  const { objectId } = ownProps;
  const { uf_crm_district: districtFields, uf_crm_subdistrict: subDistrictFields } = state.crm.leads.fields;
  const { can, uf_crm_district, uf_crm_subdistrict } = state.crm.leads.values[objectId];
  const { edit: canEdit = false } = can;
  return { objectId, canEdit, uf_crm_district, uf_crm_subdistrict, districtFields, subDistrictFields };
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { dispatch } = dispatchProps;
  const { objectId: elementId } = stateProps;
  const entityId = "leads";
  return {
    ...stateProps,
    ...ownProps,
    onChange(name, value) {
      dispatch(saveToStore({ id: entityId, elementId, name, value }))
    }
  }
};

export default connect(mapStateToProps, null, mergeProps)(District);
