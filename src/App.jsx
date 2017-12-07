import React, { Component } from "react";
import constants from "./constants";

import Header from "./Header";

import WishList from "./tables/WishList";
import Add from "./tables/WishList/Add";
import Add from "./desktop/Desktop";

import Auth from "./user/Auth";

import { ThemeProvider } from "styled-components";

import { BrowserRouter as Router, Route } from "react-router-dom";

import { Provider } from "react-redux";
import { createStore, applyMiddleware, combineReducers } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import { routerReducer } from "react-router-redux";
import { reducers as tablesReducers } from "./tables/reducers";
import { reducers as userReducers } from "./user/reducers";

import registerServiceWorker from "./registerServiceWorker";
const reducers = combineReducers({
  tables: tablesReducers,
  user: userReducers,
  routing: routerReducer
});

const store = createStore(
  reducers,
  composeWithDevTools(applyMiddleware(thunk))
);

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <ThemeProvider theme={{ constants }}>
            <div>
              <Auth>
                <div>
                  <Header />
                  <main>
                    <Route exact path="/" component={Desktop} />
                    <Route path="/crm/sale/wish/" component={WishList} />
                    <Route path="/crm/sale/show/:id/" component={Add} />
                  </main>
                </div>
              </Auth>
            </div>
          </ThemeProvider>
        </Router>
      </Provider>
    );
  }
}

export default App;
registerServiceWorker();
