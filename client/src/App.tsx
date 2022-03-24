import { Routes, Route } from "react-router-dom";
import TestModal from "./components/TestModal";
import Home from "./components/Home";

console.log("su");
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/test" element={<TestModal />} />
      </Routes>
    </div>
  );
}

export default App;
