import React from "react";
import { connect } from "react-redux";
import { Grid, TextField, Button } from "material-ui"
import SaveIcon from "material-ui-icons/Save"
import { withStyles } from "material-ui/styles";

import { isEqual } from "lodash";

const styles = theme => ({
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
    this.state = {
      reminder: {
        ...initState
      },
      isFormChanged: false
    };
  }

  handleChange = key => event => {
    this.setState({
      reminder: {
        ...this.state.reminder,
        [key]: event.target.value
      }}, this.checkFormForChange);
  };

  checkFormForChange() {
    this.setState({ isFormChanged: !isEqual(initState, this.state.reminder) });
  }

  render() {
    const { classes } = this.props;
    return (
      <form action="">
        <TextField
          id="theme"
          label="theme"
          // className={classes.textField}
          value={this.state.theme}
          onChange={this.handleChange("theme")}
          margin="normal"
        />
        {
          this.state.isFormChanged &&
          <Button className={classes.button} color="primary" variant="raised" size="small">
            <SaveIcon className={`${classes.leftIcon} ${classes.iconSmall}`} />
            Save
          </Button>
        }
      </form>
    );
  }
}

export default withStyles(styles)(Card);