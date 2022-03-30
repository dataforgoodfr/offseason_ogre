import { useContext } from "react";
import Input from "../../common/components/Input";
import OgreHeader from "../../common/components/OgreHeader";
import { Context } from "../../../context/AuthContext";

function Signup() {
  const {
    state,
    changeName,
    changeFirstName,
    changeCountry,
    changeEmail,
    changePassword,
    changePasswordConfirm,
  } = useContext(Context);

  const { name, firstName, country, email, password, confirmPassword } = state;
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
        name="name"
        value={name}
        setValue={changeName}
        placeholder="Entrer votre nom"
      />
      <Input
        text="Prénom*"
        type="text"
        name="firstname"
        value={firstName}
        setValue={changeFirstName}
        placeholder="Entrer votre prénom"
      />
      <Input
        text="Pays*"
        type="text"
        name="country"
        value={country}
        setValue={changeCountry}
        placeholder="Entrer votre pays"
      />
      <Input
        text="Email*"
        type="email"
        name="email"
        value={email}
        setValue={changeEmail}
        placeholder="Entrer votre email"
      />
      <Input
        text="Mot de passe*"
        type="password"
        name="password"
        value={password}
        setValue={changePassword}
        placeholder="Entrer votre mot de passe"
      />
      <Input
        text="Confirmation du mot de passe*"
        type="password"
        name="password-confirmation"
        value={confirmPassword}
        setValue={changePasswordConfirm}
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
