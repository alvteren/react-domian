import React, { Fragment } from "react";
import {
  Button,
  Tooltip,
  Grid,
  List,
  ListItem,
  Avatar,
  ListItemText,
  Typography
} from "material-ui";
import { AddCircleOutline as AddIcon } from "material-ui-icons";
import ShowDialog from "./ShowDialog";
import { connect } from "react-redux";
import { setCurrent } from "../../../actions/show";
import styles from "./Show.module.css";
import { ENTITIES } from "../../../../constants";

const entityId = ENTITIES.show;

const values = {
  1: {
    date: "111"
  },
  2: {
    date: "222"
  }
};

class ShowList extends React.PureComponent {
  showDialog = showId => e => {
    e.preventDefault();
    e.stopPropagation();
    this.props.setCurrent(showId);
  };

  handleDialogClose = e => {
    e.stopPropagation();
    this.props.setCurrent(null);
  };

  componentWillUnmount() {
    this.props.setCurrent(null);
  }

  render() {
    const { current, value, entityId, elementId } = this.props;
    const dialogOpen = this.props.current !== null;

    if (Object.keys(values).length) {
      return (
        <Fragment>
          <Grid container justify="center" alignItems="center">
            <Grid item xs={12} sm={10}>
              <List>
                {Object.keys(values).map((showId, index) => {
                  const show = values[showId];
                  return (
                    <ListItem
                      key={index}
                      className={styles.showListItem}
                      onClick={this.showDialog(showId)}
                    >
                      <ListItemText
                        onClick={this.showDialog(showId)}
                        disableTypography
                        primary={
                          <Typography type="Subheading">{show.date}</Typography>
                        }
                      />
                    </ListItem>
                  );
                })}
              </List>
            </Grid>
            <Grid item xs={12} sm={2}>
              <Tooltip title="Добавить показ" enterDelay={300}>
                <Avatar
                  onClick={this.showDialog(0)}
                  className={styles.showAddIcon}
                >
                  <AddIcon />
                </Avatar>
              </Tooltip>
            </Grid>
          </Grid>
          <ShowDialog
            open={dialogOpen}
            handleClose={this.handleDialogClose}
            showId={current}
            elementId={elementId}
          />
        </Fragment>
      );
    }
    return (
      <Fragment>
        <ListItem className={styles.showAddListItem}>
          <Avatar className={styles.showFullAddBtn}>
            <AddIcon />
          </Avatar>
          <ListItemText>
            <Button onClick={this.showDialog(0)} color="primary">
              Добавить показ
            </Button>
          </ListItemText>
        </ListItem>
        <ShowDialog
          open={dialogOpen}
          handleClose={this.handleDialogClose}
          elementId={elementId}
          showId={current}
        />
      </Fragment>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { current, values } = state.crm[entityId];
  const { elementId } = ownProps;
  const { uf_location: location } = state.crm[ENTITIES.lead].data[elementId];

  return {
    current,
    values,
    location
  };
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { location } = stateProps;
  const { dispatch } = dispatchProps;

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    setCurrent(showId) {
      dispatch(setCurrent({ showId, location }));
    }
  };
};

export default connect(
  mapStateToProps,
  null,
  mergeProps
)(ShowList);
