import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { Provider as AuthContext } from "./context/AuthContext";

import "./index.css";
import "antd/dist/antd.min.css";
import App from "./App";

ReactDOM.render(
  <BrowserRouter>
    <React.StrictMode>
      <AuthContext>
        <App />
      </AuthContext>
    </React.StrictMode>
  </BrowserRouter>,
  document.getElementById("root")
);
