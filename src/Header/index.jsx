import React, { Fragment } from "react";
import { Link } from "react-router-dom";

import AppBar from "material-ui/AppBar";
import Toolbar from "material-ui/Toolbar";
import Drawer from "material-ui/Drawer";
import Divider from "material-ui/Divider";
import Typography from "material-ui/Typography";
import IconButton from "material-ui/IconButton";
import { ClickAwayListener } from "material-ui";
import List, { ListItem, ListItemIcon, ListItemText } from "material-ui/List";
import Collapse from "material-ui/transitions/Collapse";

import MenuIcon from "material-ui-icons/Menu";
import ChevronLeftIcon from "material-ui-icons/ChevronLeft";
import ExpandLess from "material-ui-icons/ExpandLess";
import ExpandMore from "material-ui-icons/ExpandMore";
import StarBorderIcon from "material-ui-icons/StarBorder";
import ObjectIcon from "material-ui-icons/LocationCity";
import Customers from "material-ui-icons/SupervisorAccount";

import styles from "./Header.module.css";
import UserCard from "../user/UserCard";
import RightTools from "./RightTools";

class Header extends React.Component {
  state = {
    open: false,
    openMenu: {
      crm: false
    }
  };

  handleDrawerToggle = () => {
    this.setState({ open: !this.state.open });
  };

  handleDrawerClose = () => {
    if (this.state.open) {
      this.setState({ open: false });
    }
  };

  handleMenuItemCollapseToggle = id => {
    const isOpened = this.state.openMenu[id];
    this.setState({ openMenu: { ...this.state.openMenu, [id]: !isOpened } });
  };

  handleItemLinkClick = e => {
    this.setState({ open: false });
  };

  render() {
    return (
      <Fragment>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              className={styles.menuButton}
              color="inherit"
              aria-label="Menu"
              onClick={this.handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="title" color="inherit">
              Домианикс
            </Typography>
            <RightTools />
          </Toolbar>
        </AppBar>
        <ClickAwayListener onClickAway={this.handleDrawerClose}>
          <Drawer
            variant="persistent"
            anchor="left"
            open={this.state.open}
            onClose={this.handleDrawerToggle}
            ModalProps={{
              keepMounted: true // Better open performance on mobile.
            }}
          >
            <div className={styles.drawerHeader}>
              <UserCard />
              <IconButton onClick={this.handleDrawerToggle}>
                <ChevronLeftIcon />
              </IconButton>
            </div>
            <Divider />
            <ListItem
              button
              component={Link}
              to="/"
              onClick={this.handleItemLinkClick}
            >
              <ListItemText primary="Рабочий стол" />
            </ListItem>
            <ListItem
              button
              component={Link}
              to="/alliance"
              onClick={this.handleItemLinkClick}
            >
              <ListItemText primary="Альянсы" />
            </ListItem>
            <ListItem
              button
              onClick={() => {
                this.handleMenuItemCollapseToggle("crm");
              }}
            >
              <ListItemText primary="CRM" />
              {this.state.openMenu.crm ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={this.state.openMenu.crm} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem
                  button
                  component={Link}
                  to="/crm/wish"
                  onClick={this.handleItemLinkClick}
                >
                  <ListItemIcon>
                    <StarBorderIcon />
                  </ListItemIcon>
                  <ListItemText inset primary="Избранное" />
                </ListItem>
                <ListItem
                  button
                  component={Link}
                  to="/crm/sale"
                  onClick={this.handleItemLinkClick}
                >
                  <ListItemIcon>
                    <ObjectIcon />
                  </ListItemIcon>
                  <ListItemText inset primary="Объекты" />
                </ListItem>
                <ListItem
                  button
                  component={Link}
                  to="/crm/lead"
                  onClick={this.handleItemLinkClick}
                >
                  <ListItemIcon>
                    <Customers />
                  </ListItemIcon>
                  <ListItemText inset primary="Покупатели" />
                </ListItem>
              </List>
            </Collapse>
            <Divider />
          </Drawer>
        </ClickAwayListener>
      </Fragment>
    );
  }
}
export default Header;
