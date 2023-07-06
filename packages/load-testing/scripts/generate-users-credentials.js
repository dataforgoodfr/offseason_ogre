const fs = require("fs");
const path = require("path");
const config = require("../config");
const { generators, token } = require("../utils");

generateUsersCredentials();

async function generateUsersCredentials() {
  console.log(`Generating users credentials`);

  const credentials = new Array(config.USER_COUNT)
    .fill(0)
    .map((_, i) => generators.generateUserData(i + 1))
    .map((userData) => ({
      email: userData.email,
      token: createToken(userData.email),
    }));

  const fileContent = credentials
    .map((c) => `${c.email},${c.token}`)
    .join("\n");

  fs.writeFileSync(path.join(__dirname, "../credentials.csv"), fileContent);

  console.log(`Users credentials generated successfully`);
}

function createToken(email) {
  return token.sign(config.SECRET_KEY, {
    payload: { email, type: "magicLink" },
    expiresIn: "30d",
  });
}
