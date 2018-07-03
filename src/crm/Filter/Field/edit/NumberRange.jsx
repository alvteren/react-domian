import React from "react";
import { TextField } from "material-ui";
import styles from "./NumberRange.module.css";
import { connect } from "react-redux";
import { get } from "lodash";
import { IconButton } from "material-ui";
import CloseIcon from "material-ui-icons/Close";

class NumberRange extends React.PureComponent {
  clearValue = () => {
    const { id } = this.props;
    this.props.onChange({ name: id + "_from", value: null });
    this.props.onChange({ name: id + "_to", value: null });
  };
  render() {
    const { id, field, value_from, value_to, onChange } = this.props;

    return (
      <div className={styles.fieldWrapper}>
        <div className={styles.fieldName}>{field.label}</div>
        <div className={styles.rangeInputWrapper}>
          <TextField
            className={styles.input}
            type="number"
            fullWidth
            name={id + "_from"}
            label="От"
            value={value_from || ""}
            onChange={onChange}
          />
          <TextField
            type="number"
            fullWidth
            name={field.id + "_to"}
            label="До"
            value={value_to || ""}
            onChange={onChange}
          />
          {(Boolean(value_from) || Boolean(value_to)) && (
            <IconButton
              onClick={this.clearValue}
              className={styles.buttonClear}
              color="inherit"
            >
              <CloseIcon />
            </IconButton>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { id, entityId, elementId } = ownProps;

  const values = get(state, `crm.${entityId}.values.${elementId}`);

  return {
    value_from: get(values, id + "_from", null),
    value_to: get(values, id + "_to", null)
  };
};

export default connect(mapStateToProps)(NumberRange);
