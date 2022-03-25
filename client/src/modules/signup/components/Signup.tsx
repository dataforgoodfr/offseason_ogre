import React, { useReducer } from "react";
import Input from "../../common/components/Input";
import OgreHeader from "../../common/components/OgreHeader";

const initialState = {
  name: "",
  firstName: "",
  country: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const signupReducer = (state: typeof initialState, action: { type: string; payload: string }) => {
  switch (action.type) {
    case "change_name":
      return { ...state, name: action.payload };
    case "change_firstname":
      return { ...state, firstName: action.payload };
    case "change_country":
      return { ...state, country: action.payload };
    case "change_email":
      return { ...state, email: action.payload };
    case "change_password":
      return { ...state, password: action.payload };
    case "change_password_confirm":
      return { ...state, confirmPassword: action.payload };
    default:
      return state;
  }
};

function Signup() {
  const [{ name, firstName, country, email, password, confirmPassword }, dispatch] = useReducer(
    signupReducer,
    initialState
  );

  return (
    <form
      className="flex flex-col items-center  min-h-screen"
      style={{ backgroundColor: "#1B1B3B" }}
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <OgreHeader />
      <Input
        text="Nom*"
        type="text"
        id="name"
        name="name"
        value={name}
        setValue={(e: string) => dispatch({ type: "change_name", payload: e })}
        placeholder="Entrer votre nom"
      />
      <Input
        text="Prénom*"
        type="text"
        id="firstname"
        name="firstname"
        value={firstName}
        setValue={(e: string) => dispatch({ type: "change_firstname", payload: e })}
        placeholder="Entrer votre prénom"
      />
      <Input
        text="Pays*"
        type="text"
        id="country"
        name="country"
        value={country}
        setValue={(e: string) => dispatch({ type: "change_country", payload: e })}
        placeholder="Entrer votre pays"
      />
      <Input
        text="Email*"
        type="email"
        id="email"
        name="email"
        value={email}
        setValue={(e: string) => dispatch({ type: "change_email", payload: e })}
        placeholder="Entrer votre email"
      />
      <Input
        text="Mot de passe*"
        type="password"
        id="password"
        name="password"
        value={password}
        setValue={(e: string) => dispatch({ type: "change_password", payload: e })}
        placeholder="Entrer votre mot de passe"
      />
      <Input
        text="Confirmation du mot de passe*"
        type="password"
        id="password-confirmation"
        name="password-confirmation"
        value={confirmPassword}
        setValue={(e: string) => dispatch({ type: "change_password_confirm", payload: e })}
        placeholder="Confirmer votre mot de passe"
      />
      <button
        type="submit"
        className="text-xl rounded w-96 p-2 align-middle mb-4"
        style={{ backgroundColor: "hsl(351, 45%, 78%)", color: "#1B1B3B" }}
      >
        Créer le compte
      </button>
      <button type="button" className="text-white underline mb-4">
        Lire les conditions d&apos;utilisations
      </button>
      <div className="flex justify-center w-96 ">
        <input type="checkbox" className="m-1" />
        <span className="text-white text-xs p-1">
          En cochant cette case, je certifie avoir lu et accepté sans réserve les précédentes
          conditions générales
        </span>
      </div>
    </form>
  );
}
export default Signup;
