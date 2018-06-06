import React from "react";
import { Link } from "react-router-dom";
import { List, ListItem, Avatar, ListItemText, Typography } from "material-ui";
import { AlarmAdd as AddAlarmIcon } from "material-ui-icons";

import Reminder from "./Reminder"
import styles from "./Reminder.module.css";

const RemindeList = (props) => {
  const { value, entityId, elementId } = props;

  if (Object.keys(value).length) {
      return (
        <List>
          {Object.keys(value).map((reminderId, index) => {
            const reminder = value[reminderId];
            return (
              <Reminder
                reminder={reminder}
                entityId={entityId}
                elementId={elementId}
                reminderId={reminderId}
                key={index}
              />
            )})
          }
        </List>
      )
    }
    return (
      <Link
        to={`${entityId}/${elementId}/reminder/add`}
        onClick={e => {e.stopPropagation();}}>
        <ListItem>
          <Avatar className={styles.reminderAvatarDefault}>
            <AddAlarmIcon />
          </Avatar>
          <ListItemText>
            <Typography type="Subheading">Создать напоминание</Typography>
          </ListItemText>
        </ListItem>
      </Link>
    )
};

export default RemindeList;