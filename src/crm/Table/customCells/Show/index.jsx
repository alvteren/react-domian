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
import { dateToString } from "../../../../util/dateConverter";

const entityId = ENTITIES.show;

class ShowList extends React.PureComponent {

  state = {
    currentID: null
  };

  showDialog = showId => e => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({ currentID: this.props.elementId });
    this.props.setCurrent(showId);
  };

  handleDialogClose = e => {
    if (e) e.stopPropagation();
    this.setState({ currentID: null });
    this.props.setCurrent(null);
  };

  stopPropagation = e => {
    e.stopPropagation()
  };

  render() {
    const { current, value, entityId, elementId, edited } = this.props;
    const dialogOpen = this.props.current !== null && this.state.currentID;
    const isEdited = dialogOpen && edited instanceof Object && edited.hasOwnProperty(current);

    if (Object.keys(value).length) {
      return (
        <Fragment>
          <Grid
            container
            justify="center"
            alignItems="center"
            onClick={this.stopPropagation}
          >
            <Grid item xs={12} sm={10}>
              <List>
                {Object.keys(value).map((showId, index) => {
                  const show = value[showId];
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
                          <Typography type="Subheading">{dateToString(show.date)}</Typography>
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
            edited={isEdited}
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
        <ListItem
          onClick={this.stopPropagation}
          className={styles.showAddListItem}
        >
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
          edited={isEdited}
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
  const { current, values, edited } = state.crm[entityId];
  const { elementId, value } = ownProps;
  const { uf_location: location } = state.crm[ENTITIES.lead].data[elementId];

  return {
    current,
    values,
    location,
    edited,
    elementId,
    value
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
