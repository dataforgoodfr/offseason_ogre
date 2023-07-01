const config = require("../config");
const { generators, http } = require("../utils");

createUsers();

async function createUsers() {
  console.log(`Creating ${config.USER_COUNT} users`);
  const users = new Array(config.USER_COUNT)
    .fill(0)
    .map((_, i) => generators.generateUserData(i + 1));
  await Promise.all(users.map(postUser));
  console.log(`Users created successfully`);
}

async function postUser(userData) {
  await http.post(`${config.API_URL}/api/users/sign-up`, userData);
}
