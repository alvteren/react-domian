import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

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
  const { linked_telegram, aliance_joined } = props; // from Store
  const { classes, onShowDialogTelegram, ...other } = props; // from parent

  const handleClickAlianceAdd = () => {
    props.onClose();
    if (!linked_telegram) {
      onShowDialogTelegram();
    }
  };

  return (
    <Menu {...other}>
      {
        !aliance_joined && (
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

const mapStateToProps = (state) => {
  const { linked_telegram, aliance_joined } = state.user.user;
  return {
    linked_telegram,
    aliance_joined
  }
};

export default connect(mapStateToProps, null)(withStyles(styles)(MenuAdd));
