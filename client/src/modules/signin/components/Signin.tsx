import { useState } from "react";
import { Link } from "react-router-dom";
import Input from "../../common/components/Input";
import OgreHeader from "../../common/components/OgreHeader";

function Signin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  return (
    <form
      className="flex flex-col items-center  min-h-screen "
      style={{ backgroundColor: "#1B1B3B" }}
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <OgreHeader />
      <Input
        text="Nom d'utilisateur"
        type="text"
        id="username"
        name="username"
        value={username}
        setValue={setUsername}
        placeholder="Entrer votre nom d'utilisateur"
      />
      <Input
        text="Entrer votre mot de passe"
        type="password"
        id="password"
        name="password"
        value={password}
        setValue={setPassword}
        placeholder="Entrer votre mot de passe"
      />
      <Link to="/forgetpassword" className="text-white underline">
        Mot de passe oublié
      </Link>
      <Link to="/signup" className="text-white underline mb-4">
        Créer un compte
      </Link>
      <button
        type="submit"
        className="text-xl rounded w-96 p-2 align-middle"
        style={{ backgroundColor: "hsl(351, 45%, 78%)", color: "#1B1B3B" }}
      >
        Entrer
      </button>
    </form>
  );
}

export default Signin;
