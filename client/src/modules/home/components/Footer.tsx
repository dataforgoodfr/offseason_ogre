function Footer() {
  return (
    <footer className="flex justify-between w-screen">
      <button type="button" className="text-white flex align-start m-8">
        Plan du site
      </button>
      <button type="button" className="text-white flex align-start m-8">
        Mentions légales & CGU
      </button>
      <div className="flex flex-col m-8 ">
        <button type="button" className="text-white text-left underline mb-2">
          Login
        </button>
        <button type="button" className="text-white text-left underline mb-2">
          Administrateur
        </button>
      </div>
    </footer>
  );
}

export default Footer;
