import React, { useCallback, useMemo, useState } from "react";
import { ErrorAlertProps, SuccessAlertProps } from ".";

export { AlertProvider, useAlerts };

interface AlertContext {
  alert: AlertInternal | null;
  enqueueAlert: (alert: Alert) => void;
}

type Alert =
  | ({ severity: "error" } & ErrorAlertProps)
  | ({ severity: "success" } & SuccessAlertProps);
type AlertInternal = { id: string } & Alert;

const AlertContextImpl = React.createContext<AlertContext>({
  alert: null,
  enqueueAlert: () => {},
});
const useAlerts = () => React.useContext<AlertContext>(AlertContextImpl);

function AlertProvider({ children }: { children: React.ReactNode }) {
  const [alert, setAlert] = useState<AlertInternal | null>(null);
  const [timeouts, setTimeouts] = useState<Record<string, NodeJS.Timeout>>({});
  const [alertId, setAlertId] = useState(1);

  const removeTimeout = useCallback(
    (timeouts: Record<string, NodeJS.Timeout>, id: string) => {
      return Object.fromEntries(
        Object.entries(timeouts).filter(([entryId]) => entryId !== id)
      );
    },
    []
  );

  const enqueueAlert = useCallback(
    (alert: Alert) => {
      const id = alertId.toString();

      if (timeouts[id]) {
        clearTimeout(timeouts[id]);
      }

      setAlert({ ...alert, id });
      const timeout = setTimeout(() => {
        setTimeouts((previous) => removeTimeout(previous, id));
        setAlert(null);
      }, 6000);
      setTimeouts((previous) => ({ ...previous, [id]: timeout }));
      setAlertId((previous) => previous + 1);
    },
    [alertId, timeouts, setAlert, setAlertId, removeTimeout, setTimeouts]
  );

  const context: AlertContext = useMemo(() => {
    return {
      alert,
      enqueueAlert,
    };
  }, [alert, enqueueAlert]);

  return (
    <AlertContextImpl.Provider value={context}>
      {children}
    </AlertContextImpl.Provider>
  );
}
