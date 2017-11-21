import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import AppInternal from "./AppInternal";
import registerServiceWorker from "./registerServiceWorker";

ReactDOM.render(<AppInternal />, document.getElementById("root"));
registerServiceWorker();
