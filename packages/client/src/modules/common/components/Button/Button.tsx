import { Button as ButtonLib, CircularProgress } from "@mui/material";
import { useMemo } from "react";

export { Button };

interface ButtonProps {
  type?: "primary" | "secondary";
  loading?: boolean;
  onClick: () => void | Promise<void>;
  children: React.ReactNode;
}

function Button({
  type = "primary",
  loading = false,
  onClick,
  children,
}: ButtonProps) {
  const buttonProps = useMemo(() => {
    if (type === "primary") {
      return {
        color: "secondary",
        variant: "contained",
      };
    }
    return {
      color: "primary",
    };
  }, [type]);
  const loaderColor = useMemo(
    () => (type === "primary" ? "primary" : "secondary"),
    [type]
  );

  return (
    <ButtonLib {...(buttonProps as any)} disabled={loading} onClick={onClick}>
      {loading && (
        <CircularProgress color={loaderColor} size={16} sx={{ mr: 1 }} />
      )}
      {children}
    </ButtonLib>
  );
}
