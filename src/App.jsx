import React, { Component } from "react";
import "./App.css";
import constants from "./constants";
import Header from "./Header";
import WishList from "./objects/WishList";
import Add from "./objects/WishList/Add";

import styled, { ThemeProvider } from "styled-components";

import { BrowserRouter as Router, Route } from "react-router-dom";

import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import reducers from "./objects/reducers";

import registerServiceWorker from "./registerServiceWorker";
const Main = styled.main``;

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
              <Header />
              <Main>
                <Route exact={true} path="/" component={WishList} />
                <Route path="/crm/objects/show/:id" component={Add} />
              </Main>
            </div>
          </ThemeProvider>
        </Router>
      </Provider>
    );
  }
}

export default App;
registerServiceWorker();
