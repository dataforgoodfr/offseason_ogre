import { useEffect } from "react";
import { usePlay } from "../context/playContext";
import { useGameId } from "./hooks/useGameId";
import { Outlet } from "react-router-dom";

export { PersonalizationLayout };

function PersonalizationLayout() {
  const gameId = useGameId();
  const { readProfile } = usePlay();

  useEffect(() => {
    if (gameId) {
      readProfile();
    }
  }, [gameId, readProfile]);

  return <Outlet />;
}
