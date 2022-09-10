export { rooms };

const rooms = {
  game: (gameId: number) => `${gameId}`,
  teachers: (gameId: number) => `${gameId}/teachers`,
  players: (gameId: number) => `${gameId}/players`,
};
