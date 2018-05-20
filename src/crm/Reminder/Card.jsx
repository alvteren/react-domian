import React from "react";
import { connect } from "react-redux";
import { Grid, TextField, Button, FormControlLabel, Switch} from "material-ui"
import SaveIcon from "material-ui-icons/Save"
import { withStyles } from "material-ui/styles";

import { isEqual } from "lodash";

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
});

const initState = {
  theme: "",
  description: "",
  date: "",
  reminder: false,
  reminderInterval: ""
};

class Card extends React.Component {
  constructor(props) {
    super(props);
    const { reminder, match } = props;
    const initReminderState = reminder ? reminder : initState;
    const isNewReminder = Boolean(match.params.reminderID === "new");

    this.state = {
      reminder: {
        ...initReminderState
      },
      isFormChanged: false,
      isNewReminder
    };
  }

  static _getTomorrowDate() {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    const ISOdate = date.toISOString();
    // remove secs and timezone (:ss & .000Z) as Mui requires
    return ISOdate.substr(0, ISOdate.length - 8);
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

  onSave = () => (event) => {
    if(this.state.isNewReminder) {
      this.saveNewReminder();
    } else {
      this.updateReminder();
    }
  };

  saveNewReminder() {

  }

  updateReminder() {

  }

  render() {
    const { classes } = this.props;
    return (
      <form className={styles.reminderCardForm} action="">
        <div className="inputWrapper">
          <TextField
            id="date"
            label="Когда"
            type="datetime-local"
            defaultValue={Card._getTomorrowDate()}
            onChange={this.handleChange("date")}
            // className={}
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
                // value="Напомнить"
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
            defaultValue={Card._getTomorrowDate()}
            onChange={this.handleChange("reminderInterval")}
            disabled={!this.state.reminder.reminder}
            // className={}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </div>
        <div className="inputWrapper">
          <TextField
            id="theme"
            label="Тема"
            // className={classes.textField}
            value={this.state.theme}
            onChange={this.handleChange("theme")}
            margin="normal"
          />
        </div>
        <div className="inputWrapper">
          <TextField
            id="description"
            label="Описание"
            // className={classes.textField}
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
            <Button className={classes.button} color="primary" variant="raised" size="small">
              <SaveIcon className={`${classes.leftIcon} ${classes.iconSmall}`} onClick={this.onSave}/>
              Сохранить
            </Button>
          </div>
        }
      </form>
    );
  }
}

// const mapStateToProps = (state, ownProps) => {
//   const { match } = ownProps;
// };

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { dispatch } = dispatchProps;
  const { match } = ownProps;
  const { entityId, reminderId } = match.params;

  return {
    ...stateProps,
    ...ownProps,
    onSave(reminder) {
      dispatch(saveReminder({entityId, reminderId, reminder}))
    }
  }
};

export default withStyles(MuiStyles)(Card);