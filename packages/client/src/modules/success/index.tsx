import { useLocation } from "react-router-dom";

const Success = () => {
  const { state }: any = useLocation();

  if (state) {
    if (state.status === "signup") {
      return (
        <div className="flex justify-center items-center w-80">
          <p className="text-white text-center">
            Votre compte a été créé, un mail contenant un lien
            <br />
            de connexion a été envoyé sur l'adresse
            <br />
            <span className="underline">{state.email}</span>
            <br />
            cliquez sur le lien de connexion pour accéder à<br /> l'application.
            <br />
            Vérifiez que le mail n'est pas arrivé dans votre boîte de Spam
          </p>
        </div>
      );
    }

    if (state.status === "signin") {
      return (
        <div className="flex justify-center items-center w-80">
          <p className="text-white text-center">
            Un mail contenant un lien de connexion a été envoyé sur
            <br />
            l'adresse <span className="underline">{state.email}</span>
            <br />
            cliquez sur le lien fourni pour accéder à l'application.
            <br />
            Vérifiez que le mail n'est pas arrivé dans votre boîte de Spam
          </p>
        </div>
      );
    }
  }

  return (
    <p className="text-white text-center">
      Cliquez sur le logo pour retourner sur la page d'accueil.
    </p>
  );
};

export default Success;
