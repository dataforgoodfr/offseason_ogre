import InvertColorsIcon from "@mui/icons-material/InvertColors";
import { Link } from "react-router-dom";

const OgreHeader = () => {
  return (
    <div className="flex items-center justify-center h-[20vh]">
      <Link to="/" className="flex">
        <InvertColorsIcon style={{ fontSize: "4rem", color: "orange" }} />
        <h1 className="text-6xl text-white">OGRE</h1>
      </Link>
    </div>
  );
};

export default OgreHeader;
