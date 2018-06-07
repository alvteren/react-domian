import React, { Fragment } from "react";
import { Button, Tooltip, Grid, List, ListItem, Avatar, ListItemText, Typography } from "material-ui";
import { AddCircleOutline as AddIcon } from "material-ui-icons";
import ShowDialog from "./ShowDialog";

import styles from "./Show.module.css";

const values = {
  1: {
    date: "111"
  },
  2: {
    date: "222"
  }
};

class ShowList extends React.PureComponent {
  state = {
    dialogOpen: false
  };

  showDialog = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({ dialogOpen: true });
  };

  handleDialogClose = (e) => {
    e.stopPropagation();
    this.setState({ dialogOpen: false });
  };

  render() {
    const { value, entityId, elementId } = this.props;

    if (Object.keys(values).length) {
      return (
        <Fragment>
          <Grid container justify="center" alignItems="center">
            <Grid item xs={12} sm={10}>
              <List>
                {Object.keys(values).map((showId, index) => {
                  const show = values[showId];
                  return (
                    <ListItem className={styles.showListItem} onClick={this.showDialog}>
                      <ListItemText
                        onClick={this.showDialog}
                        disableTypography
                        primary={<Typography type="Subheading">{show.date}</Typography>}
                      />
                    </ListItem>
                  )})
                }
              </List>
            </Grid>
            <Grid item xs={12} sm={2}>
              <Tooltip title="Добавить показ" enterDelay={300}>
                <Avatar onClick={this.showDialog} className={styles.showAddIcon}>
                  <AddIcon />
                </Avatar>
              </Tooltip>
            </Grid>
          </Grid>
          <ShowDialog
            open={this.state.dialogOpen}
            handleClose={this.handleDialogClose}
          />
        </Fragment>
      )
    }
    return (
      <Fragment>
        <ListItem className={styles.showAddListItem}>
          <Avatar className={styles.showFullAddBtn}>
            <AddIcon />
          </Avatar>
          <ListItemText>
            <Button onClick={this.showDialog} color="primary">
              Добавить показ
            </Button>
          </ListItemText>
        </ListItem>
        <ShowDialog
          open={this.state.dialogOpen}
          handleClose={this.handleDialogClose}
        />
      </Fragment>
    )
  }
}

export default ShowList;