const fs = require("fs");
const path = require("path");
const config = require("../config");
const { http } = require("../utils");

registerUsersToGame();

async function registerUsersToGame() {
  console.log(`Registering users respectively to their game`);

  const usersData = loadUserData();

  const BATCH_SIZE = 10;
  let i = 0;
  while (i < usersData.length) {
    let usersDataBatch = usersData.slice(i, i + BATCH_SIZE);
    await Promise.all(usersDataBatch.map(registerUser));
    i += BATCH_SIZE;
  }

  console.log(`Users registered successfully`);
}

async function registerUser(userData) {
  await http.post(
    `${config.API_URL}/api/games/register`,
    { gameCode: userData.gameCode },
    { Authorization: `Bearer ${userData.token}` }
  );
}

function loadUserData() {
  const fileContent = fs.readFileSync(
    path.join(__dirname, "../credentials.csv"),
    { encoding: "utf8", flag: "r" }
  );

  return fileContent.split("\n").map((line) => {
    const dataChunks = line.split(",");
    return {
      email: dataChunks[0],
      token: dataChunks[1],
      gameId: dataChunks[2],
      gameCode: dataChunks[3],
    };
  });
}
