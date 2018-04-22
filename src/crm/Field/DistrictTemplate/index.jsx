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
    console.log("FFF");
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
    const districts = this.props.uf_crm_district || [];
    // ATTENTION: not tested! This filter for non-duplicate district and sub district values output
    let subDistricts;
    this.props.uf_crm_district ? subDistricts = this.props.uf_crm_subdistrict.filter((item) => {
      this.props.uf_crm_district.forEach((district) => {
        return item.link.includes(district.value);
      })
    }) : subDistricts = this.props.uf_crm_subdistrict;
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
                        onDelete={this.handleDelete({
                          field: "uf_crm_distruct или uf_crm_subdistruct",
                          value: "value1"
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
                        onDelete={this.handleDelete({
                          field: "uf_crm_distruct или uf_crm_subdistruct",
                          value: "value1"
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
          <DistrictSelect {...this.props} onCloseDialog={this.onCloseDialog} />
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
  return { canEdit, uf_crm_district, uf_crm_subdistrict, districtFields, subDistrictFields };
};
export default connect(mapStateToProps)(District);
