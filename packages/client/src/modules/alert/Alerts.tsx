import React from "react";
import { useAlerts } from "./AlertProvider";
import { ErrorAlert, SuccessAlert } from ".";

export { Alerts };

function Alerts() {
  const { alert } = useAlerts();

  return (
    <>
      {alert?.severity === "success" ? (
        <SuccessAlert {...alert} />
      ) : alert?.severity === "error" ? (
        <ErrorAlert {...alert} />
      ) : null}
    </>
  );
}
