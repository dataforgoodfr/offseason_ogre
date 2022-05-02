import { ThemeProvider } from "@mui/material";
import { Routes, Route } from "react-router-dom";
import OgreHeader from "./modules/common/components/OgreHeader";
import MagicLink from "./modules/magic-link";
import Signup from "./modules/signup";
import { theme } from "./utils/theme";

export { UnauthenticatedApp };

function UnauthenticatedApp() {
  return (
    <ThemeProvider theme={theme}>
      <div
        className="min-h-screen flex flex-col"
        style={{ backgroundColor: theme.palette.primary.main }}
      >
        <OgreHeader />
        <div className="flex flex-col min-h-[80vh] items-center">
          <Routes>
            <Route path="/" element={<MagicLink />} />
            <Route path="/magic-link" element={<MagicLink />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </div>
      </div>
    </ThemeProvider>
  );
}
