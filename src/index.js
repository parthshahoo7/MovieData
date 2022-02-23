import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import { Neo4jProvider } from "use-neo4j";
import MyApp from "./components/datepicker";
import Example from "./components/datepicker";
import DropDownDemo from "./components/dateDropDown";

const neo4j = require("neo4j-driver");
const driver = neo4j.driver(
  "bolt://54.211.132.106:7687",
  neo4j.auth.basic("neo4j", "console-august-buckle"),
  {
    /* encrypted: 'ENCRYPTION_OFF' */
  }
);

ReactDOM.render(
  <React.StrictMode>
    {/* <Neo4jProvider driver={driver}> */}
      {/* <App /> */}
      {/* <DropDownDemo/> */}
      <Example />
    {/* </Neo4jProvider> */}
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
