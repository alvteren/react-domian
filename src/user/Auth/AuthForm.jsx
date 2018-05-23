import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { authorize } from "../actions/auth";

import styles from "./AuthForm.module.css";

import Dialog, { DialogContent, withMobileDialog } from "material-ui/Dialog";
import Button from "material-ui/Button";
import AppBar from "material-ui/AppBar";
import Toolbar from "material-ui/Toolbar";
import Typography from "material-ui/Typography";
import TextField from "material-ui/TextField";
import Grid from "material-ui/Grid";
import { LinearProgress } from "material-ui";

import Slide from "material-ui/transitions/Slide";

const Transition = props => {
  return <Slide direction="up" {...props} />;
};

const AuthForm = props => {
  const { fullScreen, onAuth, hasError, message, status } = props;

  const onSubmitAuth = e => {
    e.preventDefault();
    const login = document.getElementById("login").value;
    const password = document.getElementById("password").value;
    if (login.length && password.length) {
      onAuth({ login, password });
    }
  };

  return (
    <Dialog fullScreen={fullScreen} open={true} TransitionComponent={Transition}>
      <form onSubmit={onSubmitAuth}>
        <AppBar className={styles.appBar}>
          <Toolbar>
            <Typography variant="title" color="inherit" className={styles.flex}>
              Авторизация
            </Typography>
            <Button
              variant="raised"
              color="secondary"
              onClick={onSubmitAuth}
              className={styles.buttonSave}
              type="submit"
            >
              Войти
            </Button>
          </Toolbar>
        </AppBar>
        <div className={styles.progressWrapper}>
          {status === "loading" && (
            <LinearProgress variant="query" thickness={1} />
          )}
        </div>
        <DialogContent className={styles.dialogContent}>
          <Grid container>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                id="login"
                name="login"
                label="Логин"
                margin="normal"
                autoFocus
                error={hasError}
                helperText={hasError && message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                type="password"
                required
                id="password"
                name="password"
                label="Пароль"
                margin="normal"
              />
            </Grid>
          </Grid>
        </DialogContent>
      </form>
    </Dialog>
  );
};

AuthForm.propTypes = {
  fullScreen: PropTypes.bool.isRequired
};
const mapStateToProps = state => {
  const { hasError, message, status } = state.user.auth;
  return {
    hasError,
    message,
    status
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onAuth: props => {
      const { login, password } = props;
      dispatch(authorize({ login, password }));
    }
  };
};
export default withMobileDialog()(
  connect(mapStateToProps, mapDispatchToProps)(AuthForm)
);
