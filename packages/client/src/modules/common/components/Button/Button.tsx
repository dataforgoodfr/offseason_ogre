import { Button as ButtonLib, CircularProgress, useTheme } from "@mui/material";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Icon, IconName } from "../Icon";
import { Typography } from "../Typography";

export { Button };

interface ButtonProps {
  type?: "primary" | "secondary";
  htmlType?: "button" | "submit";
  disabled?: boolean;
  loading?: boolean;
  to?: string;
  iconName?: IconName;
  width?: number | string;
  onClick?: () => void | Promise<void>;
  children: React.ReactNode;
}

function Button({
  type = "primary",
  htmlType = "button",
  disabled = false,
  loading = false,
  to = "",
  iconName,
  width,
  onClick: onClickProp,
  children,
}: ButtonProps) {
  const navigate = useNavigate();
  const theme = useTheme();

  const buttonProps = useMemo(() => {
    if (disabled) {
      return {
        props: {
          variant: "contained",
        },
        sx: {
          backgroundColor: `${theme.palette.components.button.disabled.backgroundColor} !important`,
          color: `${theme.palette.components.button.disabled.color} !important`,
        },
      };
    }
    if (type === "primary") {
      return {
        props: {
          variant: "contained",
        },
        sx: {
          backgroundColor: `${theme.palette.components.button.primary.backgroundColor} !important`,
          color: `${theme.palette.components.button.primary.color} !important`,
        },
      };
    }
    return {
      props: {
        variant: "contained",
      },
      sx: {
        backgroundColor: `${theme.palette.components.button.secondary.backgroundColor} !important`,
        color: `${theme.palette.components.button.secondary.color} !important`,
      },
    };
  }, [disabled, theme, type]);
  const loaderColor = useMemo(
    () => buttonProps.sx?.color || "black",
    [buttonProps]
  );

  const onClick = useMemo(() => {
    return () => {
      if (to.startsWith("http")) {
        window.open(to, "_blank");
      } else if (to && !to.startsWith("http")) {
        navigate(to);
      }
      onClickProp?.();
    };
  }, [to, navigate, onClickProp]);

  return (
    <ButtonLib
      type={htmlType}
      {...((buttonProps.props || {}) as any)}
      disabled={loading || disabled}
      onClick={onClick}
      sx={{
        ...(buttonProps.sx || {}),
        display: "flex",
        gap: 1,
        width,
      }}
    >
      {loading && <CircularProgress sx={{ color: loaderColor }} size={16} />}
      {iconName && !loading && (
        <Icon
          name={iconName}
          sx={{ width: "1rem", height: "1rem", color: buttonProps.sx?.color }}
        />
      )}
      <Typography as="span" sx={{ color: buttonProps.sx?.color }}>
        {children}
      </Typography>
    </ButtonLib>
  );
}
