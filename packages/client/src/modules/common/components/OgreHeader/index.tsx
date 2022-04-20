import InvertColorsIcon from "@mui/icons-material/InvertColors";
import { Typography } from "@mui/material";
import { Link } from "react-router-dom";

const OgreHeader = () => {
  return (
    <div className="flex items-center justify-center h-[20vh]">
      <Link to="/" className="flex">
        <Typography
          variant="h2"
          gutterBottom
          component="div"
          sx={{ display: "flex", alignItems: "center" }}
        >
          <InvertColorsIcon color="secondary" style={{ fontSize: "60px" }} />
          <span style={{ color: "white" }}>OGRE</span>
        </Typography>
      </Link>
    </div>
  );
};

export default OgreHeader;
