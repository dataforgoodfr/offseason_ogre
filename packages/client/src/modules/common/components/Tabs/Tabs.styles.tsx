import { styled } from "@mui/material/styles";
import { Tab, Tabs } from "@mui/material";

export { CustomTab, CustomTabs };

const CustomTabs = styled(Tabs)(({ theme }) => ({
  ".MuiTabs-indicator": {
    backgroundColor: `${theme.palette.primary.main} !important`,
    height: "3px",
  },
}));

const CustomTab = styled(Tab)(({ theme }) => ({
  backgroundColor: `${theme.palette.primary.contrastText} !important`,
  color: `${theme.palette.primary.main} !important`,
  "&:first-of-type": {
    borderTopLeftRadius: `4px`,
  },
  "&:last-of-type": {
    borderTopRightRadius: `4px`,
  },
}));
