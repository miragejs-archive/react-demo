import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";
import { makeServer } from "./server";

makeServer();

ReactDOM.render(<App />, document.getElementById("root"));
