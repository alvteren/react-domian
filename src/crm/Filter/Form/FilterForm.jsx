import React from "react";
import { connect } from "react-redux";
import { Grid } from "material-ui";
import { forEach } from "lodash";
import Field from "../Field";

class FilterForm extends React.PureComponent {
  render() {
    const { entityId, fields } = this.props;
    return (
      <Grid container spacing={24}>
        {Object.keys(fields).map(fieldName => {
          return (
            <Field
              edit={true}
              key={fieldName}
              id={fieldName}
              entityId={entityId}
              elementId="0"
            />
          );
        })}
      </Grid>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { entityId } = ownProps;
  const entityStore = state.crm[entityId];
  const { filter } = entityStore;
  const { fields } = filter;

  return { fields };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const { entityId } = ownProps;

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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FilterForm);
