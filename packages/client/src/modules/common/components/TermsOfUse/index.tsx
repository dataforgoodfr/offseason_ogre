import { Link } from "react-router-dom";

const TermsOfUse = () => {
  return (
    <Link
      className="text-white self-center hover:text-white hover:underline"
      to="/policies"
    >
      Lire les conditions d'utilisation
    </Link>
  );
};

export default TermsOfUse;
