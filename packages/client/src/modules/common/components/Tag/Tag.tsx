import { styled } from "@mui/material";
import { ReactNode } from "react";

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
      {children}
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
      backgroundColor: "hsl(0, 50%, 100%)",
    },
  };
});
