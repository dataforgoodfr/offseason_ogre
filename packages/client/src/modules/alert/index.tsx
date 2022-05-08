import { Alert, Snackbar } from "@mui/material";
import { useState } from "react";

export { ErrorAlert, SuccessAlert, AlertSnackbar };

function ErrorAlert({ message }: { message: string }) {
  return (
    <AlertSnackbar
      renderAlert={(onClose) => (
        <Alert onClose={onClose} severity="error" variant="filled">
          {message}
        </Alert>
      )}
    ></AlertSnackbar>
  );
}

function SuccessAlert() {
  return (
    <AlertSnackbar
      renderAlert={(onClose) => (
        <Alert onClose={onClose} severity="success" variant="filled">
          Succès
        </Alert>
      )}
    ></AlertSnackbar>
  );
}

function AlertSnackbar({
  renderAlert,
}: {
  renderAlert: (
    onClose: (event: React.SyntheticEvent<Element, Event>) => void
  ) => JSX.Element;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const onClose = () => setIsOpen(false);
  return (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      autoHideDuration={6000}
      onClose={onClose}
      open={isOpen}
    >
      {renderAlert(onClose)}
    </Snackbar>
  );
}
