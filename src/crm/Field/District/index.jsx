import React, { Fragment } from "react";
import { connect } from "react-redux";

import Chip from "material-ui/Chip";
import Grid from "material-ui/Grid";
import Typography from "material-ui/Typography";

import IconButton from "material-ui/IconButton";
import AddIcon from "material-ui-icons/Add";

import DistrictSelect from "./DistrictSelect";

import styles from "./index.module.css";
import { saveToStore } from "../../actions/form";
import { DISTRICTS, SUB_DISTRICTS } from "./districtTreeConverter";
import { entities } from "../../../constants";

const entityId = entities.lead;

class District extends React.PureComponent {
  state = {
    open: false,
    isTreeChanged: false,
    [DISTRICTS]: this.props[DISTRICTS] || [],
    [SUB_DISTRICTS]:
      this.props[SUB_DISTRICTS] && Array.isArray(this.props[SUB_DISTRICTS])
        ? this.props[SUB_DISTRICTS].map(item => String(item))
        : []
  };

  onChangeValue = ({ name, value }) => () => {
    const updated = this.state[name].filter(item => String(item) !== value);
    const { onChange } = this.props;
    this.setState({ [name]: updated });
    onChange(name, updated);
  };
  onOpenDialog = () => {
    this.setState({ open: true });
  };
  onCloseDialog = () => {
    this.setState({ open: false });
  };
  onTreeChange = ({ name, value, add }) => {
    const updated = add
      ? this.state[name].splice(0).concat([value]) // if item was added
      : this.state[name].splice(0).filter(item => String(item) !== value); // for delete item case
    this.setState({ isTreeChanged: true, [name]: updated });
  };
  onSaveToStore = () => {
    const { onChange } = this.props;
    const data = [
      {
        name: DISTRICTS,
        value: this.state[DISTRICTS].length
          ? this.state[DISTRICTS].map(item => Number(item))
          : false
      },
      {
        name: SUB_DISTRICTS,
        value: this.state[SUB_DISTRICTS].map(item => Number(item))
      }
    ];
    onChange(data);
    this.setState({ isTreeChanged: false, open: false });
  };

  render() {
    const {
      // id,
      // value,
      field,
      // onChange,
      // onSave,
      // formControl,
      canEdit
    } = this.props;
    const districts = this.props.uf_crm_district || [];
    // This filter for non-duplicate district and sub district values output
    const subDistricts = this.props.uf_crm_district
      ? this.props.uf_crm_subdistrict.filter(item => {
          const links = this.props.subDistrictFields.items[item].link;
          for (let i = 0; i < links.length; i++) {
            if (!this.props.uf_crm_district.some(item => item === links[i]))
              continue;
            return false;
          }
          return true;
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
                {districts.map((district, districtIndex) => {
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
                  );
                })}
                {!districts.length && !subDistricts.length ? (
                  canEdit ? (
                    <span>Добавьте районы, кликнув </span>
                  ) : (
                    <span>Не указано </span>
                  )
                ) : (
                  subDistricts.map((subDistrict, subDistrictIndex) => {
                    return (
                      <Chip
                        key={subDistrictIndex}
                        label={
                          this.props.subDistrictFields.items[subDistrict].label
                        }
                        onDelete={
                          canEdit
                            ? this.onChangeValue({
                                name: "uf_crm_subdistrict",
                                value: this.props.subDistrictFields.items[
                                  subDistrict
                                ].value
                              })
                            : false
                        }
                        className={styles.chip}
                      />
                    );
                  })
                )}
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
  const { elementId, can, fields } = ownProps;
  const {
    uf_crm_district: districtFields,
    uf_crm_subdistrict: subDistrictFields
  } = fields;

  const { values } = state.crm[entityId];
  const { uf_crm_district, uf_crm_subdistrict } = values[elementId];
  const { edit: canEdit = false } = can;

  return {
    elementId,
    canEdit,
    uf_crm_district,
    uf_crm_subdistrict,
    districtFields,
    subDistrictFields
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const { elementId } = ownProps;
  return {
    onChange(name, value) {
      dispatch(saveToStore({ entityId, elementId, name, value }));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(District);
