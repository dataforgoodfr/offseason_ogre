import { Routes, Route } from "react-router-dom";
import Home from "./modules/home";
import Signin from "./modules/signin";
import Signup from "./modules/signup";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </div>
  );
}

export default App;
