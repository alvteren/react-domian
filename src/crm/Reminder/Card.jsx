import React from "react";
import { connect } from "react-redux";
// import { Grid, TextField, Button, FormControlLabel, Switch, FormControl, InputLabel, Select, MenuItem} from "material-ui"
import { Button } from "material-ui"
import SaveIcon from "material-ui-icons/Save"
import { withStyles } from "material-ui/styles";
import Field from "../Field";

import { isEqual, get, map } from "lodash";

import { addNewReminder, updateReminder } from "../actions/reminder";
import styles from "./Card.module.css";

const MuiStyles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  iconSmall: {
    fontSize: 20,
  },
  fullWidth: {
    width: `100%`,
    marginBottom: `10px`
  }
});

const initState = {
  theme: "",
  type: "",
  description: "",
  date: getTomorrowDate(),
  reminder: false,
  reminderInterval: getTomorrowDate()
};

function  getTomorrowDate() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  const ISOdate = date.toISOString();
  // remove secs and timezone (:ss & .000Z) as Mui requires
  return ISOdate.substr(0, ISOdate.length - 8);
}

function convertDateForMui (reminder) {
  const keys = ["date", "reminderInterval"];
  const converted = Object.assign({}, reminder);
  keys.forEach((key, index) => {
    if (converted[key] && typeof converted[key] === "string") {
      converted[key] = converted[key].substr(0, converted[key].length - 9);
    }
  });
  return converted;
}

class Card extends React.Component {
  constructor(props) {
    super(props);
    const { reminder, match } = props;
    const initReminderState = reminder ? convertDateForMui(reminder) : initState;
    const isNewReminder = Boolean(match.params.reminderId === "new");

    this.state = {
      reminder: {
        ...initReminderState
      },
      isFormChanged: false,
      isNewReminder
    };
  }

  handleChange = key => event => {
    const updated = typeof this.state.reminder[key] === "boolean" ?
      !this.state.reminder[key] :
      event.target.value;

    this.setState({
      reminder: {
        ...this.state.reminder,
        [key]: updated
      }}, this.checkFormForChange);
  };

  checkFormForChange() {
    this.setState({ isFormChanged: !isEqual(initState, this.state.reminder) });
  }

  onSave = (event) => {
    const formData = this.state.reminder;
    formData.date = (new Date(formData.date)).toISOString();
    formData.reminder ?
      formData.reminderInterval = (new Date(formData.date)).toISOString() :
      formData.reminderInterval = "";
    if(this.state.isNewReminder) {
      this.props.addNewReminder(this.state.reminder);
    } else {
      this.props.updateReminder(this.state.reminder);
    }
    this.props.close();
  };

  render() {
    const { classes, entityId } = this.props;
    return (
      <form className={styles.reminderCardForm} action="">
        {map(this.props.fields, (val, id) => (
          <Field
            id={id} // id from {Fields}
            key={id}
            edit={true}
            match={this.props.match}
            entityId={"reminder"}/>
        ))}
        {/*<div className="inputWrapper">*/}

        {/*</div>*/}
        {
          this.state.isFormChanged &&
          <div className={styles.submitWrapper}>
            <Button className={classes.button} onClick={this.onSave} color="primary" variant="raised" size="small">
              <SaveIcon className={`${classes.leftIcon} ${classes.iconSmall}`} />
              Сохранить
            </Button>
          </div>
        }
      </form>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { close } = ownProps;
  const { entityId, elementId, reminderId } = ownProps.match.params;
  const { fields } = state.crm.reminder;
  const reminder = get(state, `crm.${entityId}.data.${entityId}_${elementId}.reminders.${reminderId}`, null);
  return { reminder, close, fields };
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { dispatch } = dispatchProps;
  const { match } = ownProps;
  const { entityId, elementId, reminderId } = match.params;

  return {
    ...stateProps,
    ...ownProps,
    addNewReminder(reminder) {
      dispatch(addNewReminder({entityId, elementId, reminder}))
    },
    updateReminder(reminder) {
      dispatch(updateReminder({entityId, elementId, reminderId, reminder}))
    }
  }
};

export default connect(mapStateToProps, null, mergeProps)(withStyles(MuiStyles)(Card));