export { rooms };

const rooms = {
  game: (gameId: number) => `${gameId}`,
  players: (gameId: number) => `${gameId}/players`,
  teachers: (gameId: number) => `${gameId}/teachers`,
  team: (gameId: number, teamId: number) => `${gameId}/team/${teamId}`,
  user: (gameId: number, playerId: number) => `${gameId}/users/${playerId}`,
};
