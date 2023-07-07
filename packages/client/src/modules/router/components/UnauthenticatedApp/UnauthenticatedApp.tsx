import { Routes, Route, Navigate } from "react-router-dom";
import OgreHeader from "../../../common/components/OgreHeader";
import MagicLink from "../../../magic-link";
import Signup from "../../../signup";
import { theme } from "../../../../utils/theme";
import SignIn from "../../../sign-in/SignIn";

export { UnauthenticatedApp };

function UnauthenticatedApp() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: theme.palette.primary.main }}
    >
      <OgreHeader />
      <div className="flex flex-col min-h-[80vh] items-center">
        <Routes>
          <Route path="/" element={<MagicLink />} />
          <Route path="/magic-link" element={<MagicLink />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<Navigate replace to="/" />} />
        </Routes>
      </div>
    </div>
  );
}
