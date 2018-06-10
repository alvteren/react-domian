import React, { Fragment } from "react";
import { connect } from "react-redux";
import { LinearProgress, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Typography, Button } from "material-ui";
import { ExpandMore as ExpandMoreIcon } from "material-ui-icons";
import { withStyles } from "material-ui/styles";
import Field from "../../../Field";
import { ENTITIES, GRID } from "../../../../constants";
import * as showActions from "../../../actions/show";

import { isEqual, get, map } from "lodash";

import styles from "./Card.module.css";

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
    color: theme.palette.text.secondary,
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
      save: false,
    };
  }

  // componentWillMount() {
  //   if (get(this.props, "reminder.edited", null)) {
  //     this.props.showSaveBtn(true);
  //   }
  // }

  componentDidUpdate(prevProps) {
    /* Set local init state for equal check */
    if (!this.state.initState && this.props.show) {
      // this.setInitState(prevProps.show);
    }
    /* Equal check for save button render */
    if (!isEqual(prevProps.show, this.props.show) && prevProps.show) {
      const showSave = !isEqual(this.state.initState, this.props.show);
      // this.setState({ isFormEdited: showSave }, this.props.showSaveBtn(showSave));
    }
    /* Form submit */
    const showId = this.props.showId;
    if (get(this.props, `validity.${showId}.submit`, null)) {
      // this.props.close();
    }
    /* On saving */
    if (!prevProps.save && this.props.save) {
      // this.onSave();
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
    // this.props.saveReminder(this.props.show);
  };

  addObject = () => {
    this.props.addObject();
  };

  render() {
    const { classes, show, fields, showId } = this.props;
    if (!show) {
      return (
        <div className={styles.emptyFormWrapper}>
          <LinearProgress className={styles.progressBar} variant="query" thickness={1} />
        </div>
      )
    }

    return (
      <form className={styles.showForm} action="">
        <Field
          id="date"
          edit={true}
          elementId={get(this.props, "showId", 0)}
          entityId={ENTITIES.show}
          gridType={GRID.singleColumn}
        />
        {show.objects.map((object, index) => {
          return (
            <ExpansionPanel key={index}>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography  className={classes.secondaryHeading}>
                  {`${index+1}. ${fields[object.uf_crm_type_realty]} ${object.address}`}
                </Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails className={classes.columnDirection}>
              {Object.keys(object).map((key, index) => {
                return (
                  <div key={index}>
                    <Field
                      id={fields[key].id}
                      edit={true}
                      elementId={get(this.props, "showId", 0)}
                      entityId={ENTITIES.show}
                      gridType={GRID.singleColumn}
                    />
                  </div>
                )
              })}
              </ExpansionPanelDetails>
            </ExpansionPanel>
          )
        })}
        <Button variant="raised" onClick={this.addObject}>Добавить объект</Button>
      </form>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { close, save, showSaveBtn, showId } = ownProps;

  const { form, fields, validity } = state.crm.show;

  const show = get(
    state,
    `crm.${ENTITIES.show}.values.${showId}`,
    null
  );

  return { show, close, save, showSaveBtn, form, fields, showId, validity };
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { showId } = stateProps;
  const { dispatch } = dispatchProps;
  return {
    ...stateProps,
    ...ownProps,
    addObject(object) {
      dispatch({ type: showActions.SHOW_ADD_NEW_OBJECT, payload: { entityId: ENTITIES.show, showId }})
    }
  }
};

//
// const mergeProps = (stateProps, dispatchProps, ownProps) => {
//   const { reminderId } = stateProps;
//   const { dispatch } = dispatchProps;
//   const { match } = ownProps;
//   const { entityId, elementId } = match.params;
//
//   return {
//     ...stateProps,
//     ...ownProps,
//     saveReminder(reminder) {
//       dispatch(saveReminder({
//         parent: { entityId, elementId },
//         child: { entityId: ENTITIES.reminder, elementId: reminderId },
//         reminder
//       }));
//     },
//     setEditedProp() {
//       dispatch(setEditedProp({ reminderId }));
//     }
//   };
// };

export default connect(mapStateToProps, null, mergeProps)(
  withStyles(MuiStyles)(Card)
);
