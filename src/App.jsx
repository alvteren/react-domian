import React, { Component, Fragment } from "react";
import constants from "./constants";

import Header from "./Header";

import WishList from "./crm/WishList";
import SaleList from "./crm/SaleList";
import Desktop from "./desktop/Desktop";
import AlianceList from "./aliance/List";

// import Auth from "./user/Auth";

import { ThemeProvider } from "styled-components";

import { Route } from "react-router-dom";

import { Provider } from "react-redux";
import { createStore, applyMiddleware, combineReducers } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";

import {
  routerReducer,
  routerMiddleware,
  ConnectedRouter
} from "react-router-redux";
import createHistory from "history/createBrowserHistory";

import { reducers as crmReducers } from "./crm/reducers";
import { reducers as userReducers } from "./user/reducers";
import { reducers as desktopReducers } from "./desktop/reducers";
import { reducers as appReducers } from "./app/reducers";
import { reducer as formReducer } from "redux-form";

import registerServiceWorker from "./registerServiceWorker";

const history = createHistory();
const middleware = routerMiddleware(history);

const reducers = combineReducers({
  crm: crmReducers,
  user: userReducers,
  desktop: desktopReducers,
  routing: routerReducer,
  form: formReducer,
  app: appReducers
});

export const store = createStore(
  reducers,
  composeWithDevTools(applyMiddleware(thunk, middleware))
);

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <ThemeProvider theme={{ constants }}>
            <Fragment>
              <Header />
              <main>
                <Route exact path="/" component={Desktop} />
                <Route path="/crm/sale" component={SaleList} />
                <Route path="/aliance" component={AlianceList} />
                <Route exact path="/crm/sale/wish" component={WishList} />
              </main>
            </Fragment>
          </ThemeProvider>
        </ConnectedRouter>
      </Provider>
    );
  }
}

export default App;
registerServiceWorker();
