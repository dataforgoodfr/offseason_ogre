import { Input } from "antd";
import { useState } from "react";
import PlayerDataService from "../services/player.service";
import IPlayerData from "../types/player.type";

const { Search } = Input;

function PlayerSelect() {
  const [currentPlayer, setCurrentPlayer] = useState<IPlayerData>(); // holds the request data //the Hook useState is equivalent to this.setState() in classes
  console.log(currentPlayer);
  const onSearch = (value: string) =>
    PlayerDataService.get(parseInt(value)).then((response) => {
      setCurrentPlayer(response.data);
    }); //TODO: check if value can be parsed

  return (
    <div className="w-80">
      <Search
        placeholder="Insert Player ID"
        onSearch={onSearch}
        enterButton="Search"
      />
    </div>
  );
}
export default PlayerSelect;
