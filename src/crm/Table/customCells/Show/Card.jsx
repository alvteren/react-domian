import React, { Fragment } from "react";
import { connect } from "react-redux";
import {
  LinearProgress,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Typography,
  Button
} from "material-ui";
import { ExpandMore as ExpandMoreIcon } from "material-ui-icons";
import { withStyles } from "material-ui/styles";
import Field from "../../../Field";
import { ENTITIES, GRID } from "../../../../constants";
import { addObject, saveShow, setEdited } from "../../../actions/show";

import { isEqual, get, map } from "lodash";

import styles from "./Card.module.css";

const entityId = ENTITIES.show;

const MuiStyles = theme => ({
  button: {
    margin: theme.spacing.unit
  },
  leftIcon: {
    marginRight: theme.spacing.unit
  },
  iconSmall: {
    fontSize: 20
  },
  fullWidth: {
    width: "100%",
    marginBottom: "10px"
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary
  },
  columnDirection: {
    flexDirection: "column"
  }
});

class Card extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isFormEdited: false,
      initState: null,
      save: false
    };
  }

  componentDidUpdate(prevProps) {
    /* Set local init state for equal check */
    if (!this.state.initState && this.props.show) {
      this.setInitState(prevProps.show);
    }
    /* Equal check for save button render */
    if (!isEqual(prevProps.show, this.props.show) && prevProps.show) {
      const isEdited = !isEqual(this.state.initState, this.props.show);
      this.props.setEdited();
    }
    /* Form submit */
    const showId = this.props.showId;
    if (get(this.props, `validity.${showId}.submit`, null)) {
      this.props.close();
    }
    /* On saving */
    if (!prevProps.save && this.props.save) {
      this.onSave();
    }
  }

  setInitState(initState) {
    this.setState({ initState });
  }

  componentWillUnmount() {
    if (this.state.isFormEdited) {
      this.props.setEditedProp();
    }
  }

  onSave = event => {
    this.props.saveShow(this.props.show);
  };

  addObject = () => {
    this.props.addObject();
  };

  handleKeyPress = e => {
    // space keyDown lead to table row check
    if (e.which === 32) {
      e.stopPropagation();
    }
  };

  render() {
    const { classes, show, fields, showId, validity } = this.props;

    if (!show) {
      return (
        <div className={styles.emptyFormWrapper}>
          <LinearProgress
            className={styles.progressBar}
            variant="query"
            thickness={1}
          />
        </div>
      );
    }

    return (
      <form className={styles.showForm} action="" onKeyDown={this.handleKeyPress}>
        {validity && get(validity, `${showId}.emptyItems`, null) &&
          <p className={styles.error}>Нужно заполнить данные хотя бы для одного объекта</p>
        }
        <Field
          id="date"
          edit={true}
          elementId={get(this.props, "showId", 0)}
          entityId={entityId}
          gridType={GRID.singleColumn}
        />
        {show.items.map((object, objectIndex) => {
          const preview = Object.keys(object).reduce((accumulator, key) => {
            if (accumulator.length && accumulator.slice(-1) !== "/") accumulator += "/";
            const isFilled = object[key].length;
            if (isFilled && key !== "comment") {
              if (key === "uf_crm_type_realty") {
                return accumulator += fields.uf_crm_type_realty.items[object[key][0]].label;
              }
              return accumulator += object[key];
            }
            return accumulator;
          }, "");
          return (
            <ExpansionPanel className={styles.expansionPanel} key={objectIndex}>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography className={`${classes.secondaryHeading} ${styles.preview}`}>
                  {`${objectIndex + 1}. ${preview}`}
                </Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails className={classes.columnDirection}>
                {Object.keys(object).map((key, index) => {
                  return (
                    <div key={index}>
                      <Field
                        path="items"
                        index={objectIndex}
                        id={fields[key].id}
                        edit={true}
                        elementId={get(this.props, "showId", 0)}
                        entityId={entityId}
                        gridType={GRID.singleColumn}
                      />
                    </div>
                  );
                })}
              </ExpansionPanelDetails>
            </ExpansionPanel>
          );
        })}
        <Button
          className={styles.addShowBtn}
          variant="raised"
          onClick={this.addObject}
        >
          Добавить объект
        </Button>
      </form>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  // const parentId = ENTITIES.lead;
  const { close, save, showSaveBtn, showId, elementId } = ownProps;
  const { form, fields, validity } = state.crm[entityId];
  const { uf_location: location } = state.crm[ENTITIES.lead].data[elementId];

  const show = get(state, `crm.${entityId}.values.${showId}`, null);

  return { show,
    close,
    save,
    showSaveBtn,
    form,
    fields,
    validity,
    location,
    elementId,
    showId };
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { location } = stateProps;
  const { showId, elementId } = ownProps;
  const { dispatch } = dispatchProps;

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    addObject(object) {
      dispatch(addObject({ showId, entityId }));
    },
    setEdited() {
      dispatch(setEdited({ showId, entityId }));
    },
    saveShow(show) {
      dispatch(saveShow({ entityId, elementId, showId, show }));
    }
  };
};

export default connect(
  mapStateToProps,
  null,
  mergeProps
)(withStyles(MuiStyles)(Card));
