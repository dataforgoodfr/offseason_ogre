import { ThemeProvider } from "@mui/material";
import { Routes, Route } from "react-router-dom";
import OgreHeader from "./modules/common/components/OgreHeader";
import Signin from "./modules/signin";
import Signup from "./modules/signup";
import { theme } from "./utils/theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div
        className="min-h-screen flex flex-col"
        style={{ backgroundColor: theme.palette.primary.main }}
      >
        <OgreHeader />
        <div className="flex flex-col min-h-[80vh] items-center">
          <Routes>
            <Route path="/" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
