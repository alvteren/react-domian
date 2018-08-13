import React, { Fragment } from "react";
import { connect } from "react-redux";

import Chip from "material-ui/Chip";
import Grid from "material-ui/Grid";
import Typography from "material-ui/Typography";

import IconButton from "material-ui/IconButton";
import AddIcon from "material-ui-icons/Add";

import EditDialog from "./EditDialog";

import styles from "./index.module.css";
import { saveToStore } from "../../actions/form";
import { SECTION, TYPE_REALTY } from "./TypeRealtyConverter";
import { ENTITIES } from "./../../../constants";

const entityId = ENTITIES.lead;

class TypeRealty extends React.PureComponent {
  state = {
    open: false,
    isTreeChanged: false,
    [SECTION]: this.props[SECTION] || [],
    [TYPE_REALTY]:
      this.props[TYPE_REALTY] && Array.isArray(this.props[TYPE_REALTY])
        ? this.props[TYPE_REALTY]
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
      ? this.state[name].splice(0).concat([parseInt(value)]) // if item was added
      : this.state[name].splice(0).filter(item => String(item) !== value); // for delete item case
    this.setState({ isTreeChanged: true, [name]: updated });
  };
  onSaveToStore = () => {
    const { onChange } = this.props;
    const data = [
      {
        name: TYPE_REALTY,
        value: this.state[TYPE_REALTY]
      }
    ];
    onChange(data);
    this.setState({ open: false });
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
    const typeRealty = this.props.uf_crm_type_realty || [];
    return (
      <Fragment>
        <Grid item xs={12} sm={12}>
          <div className={styles.fieldWrapper}>
            <div>
              <Typography variant="subheading" gutterBottom={true}>
                {field.label}
              </Typography>
              <div className={styles.chips}>
                {!typeRealty.length ? (
                  canEdit ? (
                    <span>Добавьте тип недвижимости, кликнув </span>
                  ) : (
                    <span>Не указано </span>
                  )
                ) : (
                  typeRealty.map((typeRealtyItem, typeRealtyItemIndex) => {
                    return (
                      <Chip
                        key={typeRealtyItemIndex}
                        label={
                          this.props.typeRealtyFields.items[typeRealtyItem]
                            .label
                        }
                        onDelete={
                          canEdit
                            ? this.onChangeValue({
                                name: "uf_crm_type_realty",
                                value: this.props.typeRealtyFields.items[
                                  typeRealtyItem
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
          <EditDialog
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
    section: sectionFields,
    uf_crm_type_realty: typeRealtyFields
  } = fields;

  const { values } = state.crm[entityId];
  const { section, uf_crm_type_realty } = values[elementId];
  const { edit: canEdit = false } = can;
  return {
    canEdit,
    section,
    uf_crm_type_realty,
    sectionFields,
    typeRealtyFields
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

export default connect(mapStateToProps, mapDispatchToProps)(TypeRealty);