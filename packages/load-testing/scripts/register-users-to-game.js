const fs = require("fs");
const path = require("path");
const config = require("../config");
const { http } = require("../utils");

registerUsersToGame();

async function registerUsersToGame() {
  console.log(`Registering users to game ${config.GAME_CODE}`);

  const fileContent = fs.readFileSync(
    path.join(__dirname, "../credentials.csv"),
    { encoding: "utf8", flag: "r" }
  );

  const tokens = fileContent.split("\n").map((line) => line.split(",")[1]);

  const BATCH_SIZE = 10;
  let i = 0;
  while (i < tokens.length) {
    let tokenBatch = tokens.slice(i, i + BATCH_SIZE);
    await Promise.all(tokenBatch.map(registerUser));
    i += BATCH_SIZE;
  }

  console.log(`Users registered successfully`);
}

async function registerUser(token) {
  await http.post(
    `${config.API_URL}/api/games/register`,
    { gameCode: config.GAME_CODE },
    { Authorization: `Bearer ${token}` }
  );
}
