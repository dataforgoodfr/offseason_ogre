import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";

import "./index.css";
import App from "./App";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import { GlobalStyles, ThemeProvider } from "@mui/material";
import { globalStyles, theme } from "./utils/theme";
import { AuthProvider } from "./modules/auth/authProvider";
import { QueryClient, QueryClientProvider } from "react-query";
import { LayoutProvider } from "./modules/Layout/context";
import { RootPlayProvider } from "./modules/play/context/playContext";
import { initErrorTracer } from "./modules/error-handling";
import { AlertProvider } from "./modules/alert";

initErrorTracer();

const queryClient = new QueryClient();

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <GlobalStyles styles={globalStyles} />
          <AlertProvider>
            <AuthProvider>
              <LayoutProvider>
                <RootPlayProvider>
                  <App />
                </RootPlayProvider>
              </LayoutProvider>
            </AuthProvider>
          </AlertProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
