import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { Popover, Button, Typography, IconButton, Tooltip, ListItem, ListItemAvatar, ListItemSecondaryAction, Avatar, ListItemText, Divider, List, CardActions } from "material-ui";
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
      anchorEl: null,
      isOutdated
    }
  }


  reminderEdit = (e) => {
  const { elementId, reminderId } = this.props;
    e.preventDefault();
    this.props.history.push(`lead/${elementId}/reminder/${reminderId}`);
  };

  onRemove = (e) => {
    e.stopPropagation();
    this.setState({ anchorEl: e.currentTarget })
  };

  handleRemove(e) {
    e.stopPropagation();
    this.setState({ anchorEl: null })
  }

  handleClose = (e) => {
    e.stopPropagation();
    this.setState({ anchorEl: null })
  };

  render() {
    const { reminder, elementId } = this.props;
    return (
      <Fragment>
        <div className={this.state.anchorEl ? `${styles.reminderWrapper} ${styles.hover}` : styles.reminderWrapper}>
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
              primary={<Typography type="Subheading">{reminder.subject}</Typography>}
              secondary={(dateToString(reminder.date))}
            />
            <ListItemSecondaryAction className={styles.reminderActions}>
             <Tooltip title="Удалить напоминание" enterDelay={300}>
               <IconButton onClick={this.onRemove} color="primary" component="span">
                 <AlarmOffIcon />
               </IconButton>
             </Tooltip>
              <Popover
                open={Boolean(this.state.anchorEl)}
                anchorEl={this.state.anchorEl}
                onClose={this.handleClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
              >
                <Typography className={styles.popoverTitle} type="title" align="center" >Вы уверены?</Typography>
                <Button className={styles.popoverBtn} onClick={this.handleRemove} variant="raised">Да</Button>
                <Button className={styles.popoverBtn} onClick={this.handleClose} variant="raised">Отмена</Button>
              </Popover>
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