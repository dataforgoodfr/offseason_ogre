import { Routes, Route } from "react-router-dom";
import OgreHeader from "./modules/common/components/OgreHeader";
import Signin from "./modules/signin";
import Signup from "./modules/signup";
import Success from "./modules/success";

function App() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#1A3D5C" }}
    >
      <OgreHeader />
      <div className="flex flex-col min-h-[80vh] items-center">
        <Routes>
          <Route path="/" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/success" element={<Success />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
