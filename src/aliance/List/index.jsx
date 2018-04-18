import React, { Fragment } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import MenuAdd from "../../Menu/Add";
import Balance from "../Balance";

import { Button } from "material-ui";
import Avatar from "material-ui/Avatar";
import Hidden from "material-ui/Hidden";
import Paper from "material-ui/Paper";
import Grid from "material-ui/Grid";
import Tabs, { Tab } from "material-ui/Tabs";
import AddIcon from "material-ui-icons/Add";
import GroupIcon from "material-ui-icons/Group";
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "material-ui/Dialog";
import Slide from "material-ui/transitions/Slide";

import constants from "../../constants";

import { Route } from "react-router-dom";

import styles from "./List.module.css";

import { map, size } from "lodash";

import { fetchList, joinToAliance } from "../actions/aliance";

import Add from "../Add";
import Detail from "../Detail";

const Transition = props => {
  return <Slide direction="up" {...props} />;
};

class AlianceList extends React.Component {
  constructor(props) {
    super(props);
    props.onInit();
  }
  state = {
    anchorEl: null,
    tabActived: "current",
    dialogs: {
      linkingTelegram: false,
      joined: false
    }
  };
  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClickByJoin = alianceId => {
    const { linked_telegram } = this.props;
    if (linked_telegram) {
      this.props.onJoinToAliance(alianceId);
      this.handleOpenDialog("joined");
    } else {
      this.handleOpenDialog("linkingTelegram");
    }
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };
  handleCloseDialog = id => {
    this.setState({ dialogs: { ...this.state.dialogs, [id]: false } });
  };
  handleOpenDialog = id => {
    this.setState({ dialogs: { ...this.state.dialogs, [id]: true } });
  };
  handleTabChange = (event, value) => {
    this.setState({ tabActived: value });
  };
  render() {
    const { data } = this.props;
    const open = Boolean(this.state.anchorEl);
    const { linked_telegram, aliance_id, aliance_joined } = this.props;
    const { tabActived } = this.state;

    return (
      <Fragment>
        <Tabs
          className={styles.tabs}
          value={this.state.tabActived}
          onChange={this.handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="Текущий рейтинг" value="current" />
          <Tab label="В прошлом месяце" value="prevMonth" />
          <Tab label="За год" value="year" />
        </Tabs>
        {tabActived === "current" && size(data) === 0 && "Альянсов пока нет"}
        {tabActived === "current" &&
          map(data, (aliance, id) => {
            const isMyAliance =
              parseInt(aliance_id, 10) > 0 && aliance_id === aliance.id;
            const wrapper = isMyAliance
              ? styles.wrapperMyAliance
              : styles.wrapper;

            return (
              <Paper className={wrapper} key={id}>
                {isMyAliance && (
                  <div className={styles.labelMyAliance}>мой альянс</div>
                )}
                <Grid className={styles.flex} container>
                  <Grid className={styles.flex} item xs={6} md={2}>
                    {aliance.img ? (
                      <Avatar src={constants.imgBaseUrl + aliance.img} />
                    ) : (
                      <Avatar>
                        <GroupIcon />
                      </Avatar>
                    )}
                    <div className={styles.alianceName}>
                      {aliance.name}
                      <div className={styles.alianceMembersCount}>
                        Участников: {aliance.members_count}
                      </div>
                      <Hidden smDown>
                        <div className={styles.alianceMembersCount}>
                          Претендентов: {aliance.applicants_count}
                        </div>
                      </Hidden>
                    </div>
                  </Grid>
                  <Hidden only={["xs", "sm"]}>
                    <Grid item md={8}>
                      <Balance id={id} />
                    </Grid>
                  </Hidden>
                  <Grid item xs={6} md={2} className={styles.wrapperButtons}>
                    <Button
                      className={styles.buttonMore}
                      size="small"
                      color="primary"
                      component={Link}
                      to={`/alliance/detail/${aliance.id}`}
                    >
                      Подробнее
                    </Button>
                    {aliance.can_join &&
                      !aliance_joined && (
                        <Button
                          className={styles.buttonMore}
                          onClick={() => {
                            this.handleClickByJoin(aliance.id);
                          }}
                          variant="raised"
                          size="small"
                          color="secondary"
                        >
                          Присоединиться
                        </Button>
                      )}
                  </Grid>
                  <Hidden only={["md", "lg"]}>
                    <Grid item xs={12}>
                      <Balance id={id} />
                    </Grid>
                  </Hidden>
                </Grid>
              </Paper>
            );
          })}
        {tabActived !== "current" && "Данных нет"}
        <Button
          variant="fab"
          color="primary"
          aria-label="add"
          className={styles.buttonAdd}
          onClick={this.handleClick}
        >
          <AddIcon />
        </Button>
        <MenuAdd
          anchorEl={this.state.anchorEl}
          open={open}
          onClose={this.handleClose}
          onShowDialogTelegram={() => {
            this.handleOpenDialog("linkingTelegram");
          }}
        />
        <Dialog
          open={this.state.dialogs.linkingTelegram}
          transition={Transition}
          keepMounted
          onClose={() => {
            this.handleCloseDialog("linkingTelegram");
          }}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle id="alert-dialog-slide-title">
            {"Привязать телеграм к Домианикс"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              Вы не можете присоединиться к альянсу пока Ваш телеграм не связан
              с Домианикс. Домианикс взаимодействует с месcенджером{" "}
              <a
                href="https://telegram.org/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Телеграм
              </a>. Он автоматически добавит Вас в чат альянса. Для этого Вам
              необходимо нажать на кнопку "Перейти к Роботу Домианикс" и далее
              отправить роботу сообщение <b>/start</b>. После этого робот Вас
              ответит, в ответе будет кнопка "Привязать телеграм к Домианиксу".
              Нажмите на нее. У Вас откроется страница привязки Домианикс
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                this.handleCloseDialog("linkingTelegram");
              }}
              href="https://t.me/domian_bot"
              target="_blank"
              color="primary"
              variant="raised"
            >
              Перейти к Роботу
            </Button>
            <Button
              onClick={() => {
                this.handleCloseDialog("linkingTelegram");
              }}
              color="primary"
            >
              Закрыть
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={this.state.dialogs.joined}
          transition={Transition}
          keepMounted
          onClose={() => {
            this.handleCloseDialog("joined");
          }}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle id="alert-dialog-slide-title">
            {"Запрос отправлен"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              Ваш запрос на присоединение отправлен. Как только не менее 30%
              участников альянса проголосую "за". Вы станете учатником альянса.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                this.handleCloseDialog("joined");
              }}
              color="primary"
            >
              Закрыть
            </Button>
          </DialogActions>
        </Dialog>
        <Route path="/alliance/add" component={Add} />
        <Route path="/alliance/detail/:id" component={Detail} />
      </Fragment>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const {
    filter,
    page,
    rowsPerPage,
    orderBy,
    order,
    data
  } = state.aliance.aliances;

  const { linked_telegram, aliance_id, aliance_joined } = state.user.user;

  return {
    filter,
    page,
    rowsPerPage,
    orderBy,
    order,
    data,
    linked_telegram,
    aliance_id,
    aliance_joined
  };
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { filter, page, rowsPerPage, orderBy, order } = stateProps;
  const { dispatch } = dispatchProps;

  return {
    ...ownProps,
    ...stateProps,
    onInit: () => {
      dispatch(fetchList({ filter, page, rowsPerPage, orderBy, order }));
    },
    onJoinToAliance: id => {
      dispatch(joinToAliance(id));
    }
  };
};
export default connect(mapStateToProps, null, mergeProps)(AlianceList);
