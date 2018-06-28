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
import {SECTION, TYPE_REALTY, typeRealtyConverter} from "./TypeRealtyConverter";
import { ENTITIES } from "./../../../constants";

const leadEntity = ENTITIES.lead;

class TypeRealty extends React.PureComponent {
  constructor(props) {
    super(props);
    const { entityId } = props;
    let typeRealty;
    if (entityId === ENTITIES.lead) {
      typeRealty = this.props[TYPE_REALTY] && Array.isArray(this.props[TYPE_REALTY])
        ? this.props[TYPE_REALTY]
        : [];
    } else {
      typeRealty = this.props[TYPE_REALTY] || "";
    }

    this.state = {
      open: false,
      isTreeChanged: false,
      [SECTION]: this.props[SECTION] || [],
      [TYPE_REALTY]: typeRealty
    };
  }

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
    const { entityId } = this.props;
    if (entityId === ENTITIES.show) {
      this.setState({ isTreeChanged: true, [TYPE_REALTY]: [value] });
      return;
    }
    const updated = add
      ? this.state[name].splice(0).concat([parseInt(value)]) // if item was added
      : this.state[name].splice(0).filter(item => String(item) !== value); // for delete item case
    this.setState({ isTreeChanged: true, [name]: updated });
  };
  onSaveToStore = () => {
    const { onChange } = this.props;
    onChange(TYPE_REALTY, this.state[TYPE_REALTY]);
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
      canEdit,
      validateError
    } = this.props;
    let typeRealty = this.props.uf_crm_type_realty || [];

    return (
      <Fragment>
        <Grid item xs={12} sm={12}>
          <div className={styles.fieldWrapper}>
            <div>
              <Typography className={validateError? styles.error: ""} variant="subheading" gutterBottom={true}>
                {field.label}
              </Typography>
              {
                validateError &&
                <p className={styles.validateError}>{validateError.message}</p>
              }
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
  const { entityId, elementId, can, fields, index } = ownProps;
  const {
    section: sectionFields,
    uf_crm_type_realty: typeRealtyFields
  } = fields;

  let section, uf_crm_type_realty;
  const { edit: canEdit = false } = can;

  if (entityId === ENTITIES.show) {
    /* SHOW branch */
    const { values, current } = state.crm[entityId];
    section = values[elementId].items.section;
    uf_crm_type_realty = values[elementId].items[index].uf_crm_type_realty;

    return {
      current,
      entityId,
      canEdit,
      section,
      uf_crm_type_realty,
      sectionFields,
      typeRealtyFields
    };
  } else {
    /* LEAD branch */
    const { values } = state.crm[leadEntity];
    section = values[elementId].section;
    uf_crm_type_realty = values[elementId].uf_crm_type_realty;

    return {
      entityId,
      canEdit,
      section,
      uf_crm_type_realty,
      sectionFields,
      typeRealtyFields
    };
  }
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { current } = stateProps;
  const { dispatch } = dispatchProps;
  const { entityId, elementId } = ownProps;
  return {
    ...stateProps,
    ...ownProps,
    onChange(name, value) {
      dispatch(saveToStore({ entityId, elementId, name, value, index: current }));
    }
  };
};

export default connect(mapStateToProps, null,  mergeProps)(TypeRealty);
