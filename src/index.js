import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";
import { startMirage } from "./mirage";

startMirage({ environment: "development" });

ReactDOM.render(<App />, document.getElementById("root"));