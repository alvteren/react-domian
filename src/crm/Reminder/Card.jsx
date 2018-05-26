import React from "react";
import { connect } from "react-redux";
import { Button, CircularProgress } from "material-ui";
import SaveIcon from "material-ui-icons/Save";
import { withStyles } from "material-ui/styles";
import Field from "../Field";
import { ENTITIES, GRID } from "../../constants";

import { isEqual, get, map } from "lodash";

import {
  addNewReminder,
  updateReminder,
  setEditedProp
} from "../actions/reminder";
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
  progress: {
    display: "block",
    margin: "30px auto"
  }
});

class Card extends React.PureComponent {
  constructor(props) {
    super(props);
    const { match } = props;
    const isNewReminder = Boolean(match.params.reminderId === "add");

    this.state = {
      isFormEdited: false,
      isNewReminder,
      initState: null
    };
  }

  componentDidUpdate(prevProps) {
    if (!this.state.initState) {
      this.setInitState(prevProps.reminder);
    }
    if (!isEqual(prevProps.reminder, this.props.reminder)) {
      this.setState({
        isFormEdited: !isEqual(this.state.initState, this.props.reminder)
      });
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
    if (this.state.isNewReminder) {
      this.props.addNewReminder(this.props.reminder);
    } else {
      this.props.updateReminder(this.props.reminder);
    }
    this.props.close();
  };

  render() {
    const { classes, reminder } = this.props;
    if (!reminder) {
      return <CircularProgress className={classes.progress}/>
    }
    debugger;
    return (
      <form className={styles.reminderCardForm} action="">
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
        {(this.state.isFormEdited || this.props.reminder.edited) && (
          <div className={styles.submitWrapper}>
            <Button
              className={classes.button}
              onClick={this.onSave}
              color="primary"
              variant="raised"
              size="small"
            >
              <SaveIcon
                className={`${classes.leftIcon} ${classes.iconSmall}`}
              />
              Сохранить
            </Button>
          </div>
        )}
      </form>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { close } = ownProps;
  let { reminderId } = ownProps.match.params;
  const { fields } = state.crm.reminder;
  reminderId === "add" ? (reminderId = 0) : reminderId;
  const reminder = get(
    state,
    `crm.${ENTITIES.reminder}.values.${reminderId}`,
    null
  );
  return { reminder, close, fields, reminderId };
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { reminderId } = stateProps;
  const { dispatch } = dispatchProps;
  const { match } = ownProps;
  const { entityId, elementId } = match.params;

  return {
    ...stateProps,
    ...ownProps,
    addNewReminder(reminder) {
      dispatch(addNewReminder({ entityId, elementId, reminder }));
    },
    updateReminder(reminder) {
      dispatch(updateReminder({ entityId, elementId, reminderId, reminder }));
    },
    setEditedProp() {
      dispatch(setEditedProp({ reminderId }));
    }
  };
};

export default connect(mapStateToProps, null, mergeProps)(
  withStyles(MuiStyles)(Card)
);
