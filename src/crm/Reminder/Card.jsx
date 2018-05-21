import React from "react";
import { connect } from "react-redux";
import { Grid, TextField, Button, FormControlLabel, Switch, FormControl, InputLabel, Select, MenuItem} from "material-ui"
import SaveIcon from "material-ui-icons/Save"
import { withStyles } from "material-ui/styles";

import { isEqual, get } from "lodash";

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

class Card extends React.Component {
  constructor(props) {
    super(props);
    const { reminder, match } = props;
    const initReminderState = reminder ? reminder : initState;
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
    const { classes } = this.props;
    return (
      <form className={styles.reminderCardForm} action="">
        <FormControl className={classes.fullWidth}>
          <InputLabel htmlFor="type">Тип</InputLabel>
          <Select
            value={this.state.reminder.type}
            onChange={this.handleChange("type")}
            inputProps={{
              name: 'type',
              id: 'type',
            }}>
            <MenuItem value="call">Звонок</MenuItem>
            <MenuItem value="meeting">Встреча</MenuItem>
          </Select>
        </FormControl>
        <div className="inputWrapper">
          <TextField
            id="date"
            label="Когда"
            type="datetime-local"
            defaultValue={this.state.reminder.date}
            onChange={this.handleChange("date")}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </div>
        <div className="inputWrapper">
          <FormControlLabel
            control={
              <Switch
                checked={this.state.reminder.reminder}
                onChange={this.handleChange("reminder")}
                color="primary"
              />
            }
            label="Напомнить"
          />
        </div>
        <div className="inputWrapper">
          <TextField
            id="reminderInterval"
            label="Напомнить"
            type="datetime-local"
            defaultValue={this.state.reminder.reminderInterval}
            onChange={this.handleChange("reminderInterval")}
            disabled={!this.state.reminder.reminder}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </div>
        <div className="inputWrapper">
          <TextField
            id="theme"
            label="Тема"
            value={this.state.theme}
            onChange={this.handleChange("theme")}
            margin="normal"
          />
        </div>
        <div className="inputWrapper">
          <TextField
            id="description"
            label="Описание"
            value={this.state.theme}
            onChange={this.handleChange("description")}
            margin="normal"
            multiline={true}
            rowsMax="4"
          />
        </div>
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
  const reminder = get(state, `crm.${entityId}.data.${entityId}_${elementId}.reminders.${reminderId}`, null);
  return { reminder, close };
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