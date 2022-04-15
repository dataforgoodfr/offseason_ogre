import logo from "./logo.svg";
import PlayerSelect from "./components/PlayerSelect";

function App() {
  return (
    <div className="App bg-slate-800 h-screen">
      <header className="App-header space-y-60 flex flex-col items-center">
        <img
          src={logo}
          className="App-logo max-w-3xl max-h-3xl animate-[spin_4s_linear_infinite]"
          alt="logo"
        />
        <PlayerSelect />
      </header>
    </div>
  );
}

export default App;
