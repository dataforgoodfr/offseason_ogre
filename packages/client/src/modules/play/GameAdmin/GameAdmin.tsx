import { PlayBox } from "../Components";
import { PlayProvider, usePlay } from "../context/playContext";
import { PlayLayout } from "../PlayLayout";

export { GameAdmin };

function GameAdmin() {
  return (
    <PlayLayout title="Console Animateur">
      <PlayProvider>
        <GameAdminContent />
      </PlayProvider>
    </PlayLayout>
  );
}

function GameAdminContent() {
  const { game } = usePlay();
  return <PlayBox>{game.name}</PlayBox>;
}
