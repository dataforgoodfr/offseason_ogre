import { Link } from "react-router-dom";
import drop from "../../../../assets/images/drop.png";

function OgreHeader() {
  return (
    <Link to="/" className="flex justify-center w-96">
      <img
        src={drop}
        alt="drop"
        style={{
          height: "4.5rem",
          filter:
            "invert(100%) sepia(18%) saturate(7237%) hue-rotate(287deg) brightness(93%) contrast(87%)",
        }}
        className="mt-2"
      />
      <h1 className="uppercase text-white text-7xl">ogre</h1>
    </Link>
  );
}

export default OgreHeader;
