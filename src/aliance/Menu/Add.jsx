import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import Menu, { MenuItem } from "material-ui/Menu";
import { withStyles } from "material-ui/styles";
import { ListItemIcon, ListItemText } from "material-ui/List";
import GroupAddIcon from "material-ui-icons/GroupAdd";

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
  const { classes, linkedTelegram, onShowDialogTelegram, alianceJoined, ...other } = props;

  const handleClickAlianceAdd = () => {
    props.onClose();
    if (!linkedTelegram) {
      onShowDialogTelegram();
    }
  };

  return (
    <Menu {...other}>
      {
        !alianceJoined && (
          <MenuItem
            component={Link}
            to="/alliance/add"
            className={classes.menuItem}
            onClick={handleClickAlianceAdd}
          >
            <ListItemIcon>
              <GroupAddIcon />
            </ListItemIcon>
            <ListItemText inset primary="Создать альянс" />
          </MenuItem>
        )
      }
      {/*  <MenuItem
        component={Link}
        to="/alliance/join"
        className={classes.menuItem}
        onClick={props.onClose}
      >
        <ListItemIcon>
          <GroupAddIcon />
        </ListItemIcon>
        <ListItemText inset primary="Пригласить в альянс" />
      </MenuItem> */}
    </Menu>
  );
};

MenuAdd.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(MenuAdd);
