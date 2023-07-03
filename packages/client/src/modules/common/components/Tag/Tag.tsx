import { styled } from "@mui/material";
import { ReactNode } from "react";
import { Typography } from "../Typography";

export { Tag };

function Tag({
  type,
  color,
  icon,
  children,
}: {
  type?: "success" | "error" | "secondary";
  color?: string;
  icon?: ReactNode;
  children: ReactNode;
}) {
  const className = type || "";

  return (
    <TagStyled className={className} sx={{ backgroundColor: color }}>
      {icon}
      <Typography as="span">{children}</Typography>
    </TagStyled>
  );
}

const TagStyled = styled("span")(({ theme }) => {
  return {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(0.5),
    flexGrow: 0,
    flexShrink: 0,
    inlineSize: "fit-content",
    padding: theme.spacing(0.5),
    borderRadius: "10px",
    color: "#ffffff",
    "&.success": {
      backgroundColor: theme.palette.status.success,
    },
    "&.error": {
      backgroundColor: theme.palette.status.error,
    },
    "&.secondary": {
      backgroundColor: theme.palette.components.tag.secondary.backgroundColor,
      color: theme.palette.components.tag.secondary.color,
    },
  };
});
