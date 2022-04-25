// Sync object
/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  verbose: true,
  setupFiles: ["jest-plugin-context/setup"],
};
// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config({ path: `${__dirname}/.env` });

module.exports = config;

// Or async function
module.exports = async () => ({
  verbose: true,
});
