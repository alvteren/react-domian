import React from "react";
import { connect } from "react-redux";

import { authorizeBy } from "../../user/actions/auth";

import { withStyles } from "material-ui/styles";
import Grid from "material-ui/Grid";
import BookmarkBorderIcon from "material-ui-icons/BookmarkBorder";

import { Link } from "react-router-dom";

const styles = theme => ({
  title: {
    fontSize: "1.5rem"
  },
  bookMark: {
    color: "orange"
  },
  iconBookmark: {
    width: "4em",
    height: "4em"
  }
});

// const Title = styled.h3``;
const mapDispatchToProps = dispatch => {
  return {
    authorizeBy: () => {
      const userId = document.getElementById("auth_id").value;
      dispatch(authorizeBy(userId));
    }
  };
};
export default connect(null, mapDispatchToProps)(
  withStyles(styles)(props => {
    const { classes } = props;
    return (
      <Grid container spacing={24}>
        <Grid item xs={6} sm={3} lg={2} className={classes.bookMark}>
          <BookmarkBorderIcon className={classes.iconBookmark} />
          <h3 className={classes.title}>Избранное</h3>
        </Grid>
        <Grid item xs={6} sm={3} lg={2}>
          <Link to="/crm/sale">
            <BookmarkBorderIcon className={classes.iconBookmark} />
            <h3 className={classes.title}>CRM</h3>
          </Link>
        </Grid>
        <Grid item xs={6} sm={3} lg={2}>
          <Link to="/alliance">
            <BookmarkBorderIcon className={classes.iconBookmark} />
            <h3 className={classes.title}>Альянсы</h3>
          </Link>
        </Grid>
        {/* <Grid item xs={6} sm={3} lg={2}>
          <h3 className={classes.title}>Авторизация</h3>
          <TextField
            required
            id="auth_id"
            label="ID пользователя"
            margin="normal"
            autoFocus
          />
          <Button variant="raised" color="primary" onClick={authorizeBy}>
            Авторизоваться
          </Button>
        </Grid> */}
      </Grid>
    );
  })
);
