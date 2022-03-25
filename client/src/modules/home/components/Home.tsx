import { Link } from "react-router-dom";
import OgreHeader from "../../common/components/OgreHeader";
import Footer from "./Footer";

function Home() {
  return (
    <div
      className="flex flex-col items-center justify-between  min-h-screen"
      style={{ backgroundColor: "#1B1B3B" }}
    >
      <OgreHeader />
      <div className="flex flex-col items-center justify-between">
        <Link
          to="/signup"
          className="text-xl rounded w-56 p-2 align-middle text-center"
          style={{ backgroundColor: "hsl(351, 45%, 78%)", color: "#1B1B3B" }}
        >
          Créer son compte
        </Link>
        <Link to="/signin" className="text-white underline mb-4">
          Se connecter
        </Link>
      </div>
      <Footer />
    </div>
  );
}

export default Home;
