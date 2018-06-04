import React from "react";
import { connect } from "react-redux";
import { LinearProgress } from "material-ui";
import { withStyles } from "material-ui/styles";
import Field from "../Field";
import { ENTITIES, GRID } from "../../constants";

import { isEqual, get, map } from "lodash";

import { setEditedProp, upsertReminder } from "../actions/reminder";
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
  }
});

class Card extends React.PureComponent {
  constructor(props) {
    super(props);
    const { match } = props;
    const isNewReminder = Boolean(match.params.reminderId === "add");

    this.state = {
      isFormEdited: false,
      initState: null,
      save: false,
      isNewReminder,
    };
  }

  componentWillMount() {
    if (get(this.props, "reminder.edited", null)) {
      this.props.showSaveBtn(true);
    }
  }

  componentDidUpdate(prevProps) {
    /* Set local init state for equal check */
    if (!this.state.initState && this.props.reminder) {
      this.setInitState(prevProps.reminder);
    }
    /* Equal check for save button render */
    if (!isEqual(prevProps.reminder, this.props.reminder) && prevProps.reminder) {
      const showSave = !isEqual(this.state.initState, this.props.reminder);
      this.setState({ isFormEdited: showSave }, this.props.showSaveBtn(showSave));
    }
    /* Form submit */
    const reminderId = this.props.reminderId;
    if (get(this.props, `validity.${reminderId}.submit`, null)) {
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
    this.props.saveReminder(this.props.reminder);
  };

  render() {
    const { classes, reminder } = this.props;
    if (!reminder) {
      return (
        <div className={styles.emptyFormWrapper}>
          <LinearProgress className={styles.progressBar} variant="query" thickness={1} />
        </div>
      )
    }

    return (
      <form className={styles.reminderForm} action="">
        {map(this.props.fields, (val, id) => (
          <div key={id} className={styles.inputWrapper}>
            <Field
              id={id} // id from {Fields}
              edit={true}
              elementId={get(this.props, "reminderId", 0)}
              entityId={ENTITIES.reminder}
              gridType={GRID.singleColumn}
            />
          </div>
        ))}
      </form>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { close, save, showSaveBtn } = ownProps;
  let { reminderId } = ownProps.match.params;
  const { fields, validity } = state.crm.reminder;
  reminderId === "add" ? (reminderId = 0) : reminderId;
  const reminder = get(
    state,
    `crm.${ENTITIES.reminder}.values.${reminderId}`,
    null
  );
  return { reminder, close, save, showSaveBtn, fields, reminderId, validity };
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { reminderId } = stateProps;
  const { dispatch } = dispatchProps;
  const { match } = ownProps;
  const { entityId, elementId } = match.params;

  return {
    ...stateProps,
    ...ownProps,
    saveReminder(reminder) {
      dispatch(upsertReminder({
        parent: { entityId, elementId },
        child: { entityId: ENTITIES.reminder, elementId: reminderId },
        reminder
      }));
    },
    setEditedProp() {
      dispatch(setEditedProp({ reminderId }));
    }
  };
};

export default connect(mapStateToProps, null, mergeProps)(
  withStyles(MuiStyles)(Card)
);
