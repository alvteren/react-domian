import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import Menu, { MenuItem } from "material-ui/Menu";
import { withStyles } from "material-ui/styles";
import { ListItemIcon, ListItemText } from "material-ui/List";
import AddObjectIcon from "material-ui-icons/LocationCity";

const styles = theme => ({
  menuItem: {
    "&:focus": {
      background: theme.palette.primary[500],
      "& $text, & $icon": {
        color: theme.palette.common.white
      }
    }
  },
  text: {},
  icon: {}
});

const MenuAdd = props => {
  const { classes, ...other } = props;

  return (
    <Menu {...other}>
      <MenuItem
        component={Link}
        to="/aliance/add"
        className={classes.menuItem}
        onClick={props.onClose}
      >
        <ListItemIcon className={classes.icon}>
          <AddObjectIcon />
        </ListItemIcon>
        <ListItemText
          classes={{ text: classes.text }}
          inset
          primary="Создать альянс"
        />
      </MenuItem>
    </Menu>
  );
};

MenuAdd.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(MenuAdd);
