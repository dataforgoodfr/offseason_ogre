import { Alert, Snackbar } from "@mui/material";
import { useState } from "react";
import ReactDOM from "react-dom";

export { ErrorAlert, SuccessAlert, AlertSnackbar };

function ErrorAlert({
  message,
  alertPosition = "default",
}: {
  message: string;
  alertPosition?: string;
}) {
  return (
    <AlertSnackbar
      alertPosition={alertPosition}
      renderAlert={(onClose) => (
        <Alert onClose={onClose} severity="error" variant="filled">
          {message}
        </Alert>
      )}
    ></AlertSnackbar>
  );
}

function SuccessAlert({
  alertPosition = "default",
  message = "Succès",
  onClose,
}: {
  alertPosition?: string;
  message?: string;
  onClose?: () => void;
}) {
  return (
    <AlertSnackbar
      alertPosition={alertPosition}
      onClose={onClose}
      renderAlert={(onClose) => (
        <Alert onClose={onClose} severity="success" variant="filled">
          {message}
        </Alert>
      )}
    ></AlertSnackbar>
  );
}

function AlertSnackbar({
  renderAlert,
  alertPosition = "default",
  onClose: onCloseProp,
}: {
  renderAlert: (
    onClose: (event: React.SyntheticEvent<Element, Event>) => void
  ) => JSX.Element;
  alertPosition?: string;
  onClose?: () => void;
}) {
  const position = choosePosition(alertPosition);
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const onClose = () => {
    onCloseProp?.();
    setIsOpen(false);
  };

  return ReactDOM.createPortal(
    <Snackbar
      anchorOrigin={position}
      autoHideDuration={6000}
      onClose={onClose}
      open={isOpen}
    >
      {renderAlert(onClose)}
    </Snackbar>,
    document.getElementById("root")!
  );
}

function choosePosition(position: string) {
  if (position === "top") {
    return { vertical: "top" as const, horizontal: "center" as const };
  }
  return { vertical: "bottom" as const, horizontal: "right" as const };
}
