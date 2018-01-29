import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Grid } from "material-ui";
import { withStyles } from "material-ui/styles";
import Field from "../Field";
import { map } from "lodash";

const Form = props => {
  const { classes, filterFields } = props;
  return (
    <div className={classes.wrapper}>
      <Grid container>
        {map(filterFields, (val, fieldName) => {
          return <Field edit={true} key={fieldName} id={fieldName} />;
        })}
        <Grid item xs={12} sm={6} />
      </Grid>
    </div>
  );
};

Form.propTypes = {
  id: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired
};
const styles = theme => ({});
const mapStateToProps = (state, ownProps) => {
  const table = state.crm[ownProps.id];
  const { filterFields } = table;
  return { filterFields };
};
const mapDispatchToProps = (dispatch, ownProps) => {
  // const tableId = ownProps.id;
  return {
    init: () => {},
    onDeleteChip: id => {
      // dispatch(deleteChip({ id: tableId, chipId: id }));
    },
    onFilterChange: query => {
      // dispatch(fetchChips({ id: tableId, query }));
    },
    onApplyChips: () => {}
  };
};
export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(Form)
);
