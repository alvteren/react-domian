import React, { Component, Fragment } from "react";
import constants from "./constants";

import Header from "./Header";

import WishList from "./tables/WishList";
import SaleList from "./tables/SaleList";
import Desktop from "./desktop/Desktop";

// import Auth from "./user/Auth";

import { ThemeProvider } from "styled-components";

import { BrowserRouter, Route } from "react-router-dom";

import { Provider } from "react-redux";
import { createStore, applyMiddleware, combineReducers } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";

import { routerReducer, routerMiddleware } from "react-router-redux";
import createHistory from "history/createBrowserHistory";

import { reducers as tablesReducers } from "./tables/reducers";
import { reducers as userReducers } from "./user/reducers";
import { reducers as desktopReducers } from "./desktop/reducers";
import { reducer as formReducer } from "redux-form";
import registerServiceWorker from "./registerServiceWorker";

const history = createHistory();
const middleware = routerMiddleware(history);

const reducers = combineReducers({
  tables: tablesReducers,
  user: userReducers,
  desktop: desktopReducers,
  routing: routerReducer,
  form: formReducer
});

export const store = createStore(
  reducers,
  composeWithDevTools(applyMiddleware(thunk, middleware))
);

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <ThemeProvider theme={{ constants }}>
            <Fragment>
              <Header />
              <main>
                <Route exact path="/" component={Desktop} />
                <Route path="/crm/sale" component={SaleList} />
                <Route path="/crm/sale/wish" component={WishList} />
              </main>
            </Fragment>
          </ThemeProvider>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
registerServiceWorker();
