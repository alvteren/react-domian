import React from "react";

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

export default withStyles(styles)(props => {
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
        <Link to="/aliance">
          <BookmarkBorderIcon className={classes.iconBookmark} />
          <h3 className={classes.title}>Альянсы</h3>
        </Link>
      </Grid>
    </Grid>
  );
});
