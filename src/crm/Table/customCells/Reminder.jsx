import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { Typography, IconButton, Tooltip, ListItem, ListItemAvatar, ListItemSecondaryAction, Avatar, ListItemText, Divider, List, CardActions } from "material-ui";
import { AlarmOff as AlarmOffIcon , AlarmAdd as AddAlarmIcon, PhoneForwarded as CallIcon, Person as MeetIcon } from "material-ui-icons";
import {dateToString} from "../../../util/dateConverter";
import styles from "./Reminder.module.css";
import {withRouter} from "react-router-dom";
import { withStyles } from "material-ui/styles";

const MuiStyles = (theme) => ({

});

class Reminder extends React.PureComponent {
  constructor(props) {
    super(props);
    const { date } = props.reminder;
    const isOutdated = new Date(date) - new Date() < 0;
    this.state = {
      showControls: false,
      isOutdated
    }
  }


  reminderEdit(e) {
  const { elementId, reminderId } = this.props;
    e.preventDefault();
    this.props.history.push(`lead/${elementId}/reminder/${reminderId}`);
  }

  render() {
    const { reminder, elementId } = this.props;
    return (
      <Fragment>
        <div className={styles.reminderWrapper}>
          <ListItem
            onClick={this.reminderEdit}

          >
            <Avatar className={this.state.isOutdated ? styles.reminderAvatarOutdated : styles.reminderAvatar}>
              {
                reminder.type === "call" ?
                  <CallIcon /> :
                  <MeetIcon />
              }
            </Avatar>
            <ListItemText
              disableTypography
              primary={<Typography type="Subheading">reminder.subject</Typography>}
              secondary={(dateToString(reminder.date))}
            />
            <ListItemSecondaryAction className={styles.reminderActions}>
              <Tooltip title="Удалить напоминание" enterDelay={300}>
                <IconButton color="primary" component="span">
                  <AlarmOffIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Новое напоминание" enterDelay={300}>
                <Link onClick={(e) => {e.stopPropagation()} } to={`lead/${elementId}/reminder/add`}>
                  <IconButton color="primary" component="span">
                    <AddAlarmIcon />
                  </IconButton>
                </Link>
              </Tooltip>
            </ListItemSecondaryAction>
          </ListItem>
        </div>
        <Divider inset component="li" />
      </Fragment>
    )
  }
}

export default withRouter(Reminder);