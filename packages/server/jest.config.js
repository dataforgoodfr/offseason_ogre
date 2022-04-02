// Sync object
/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
    verbose: true,
    setupFiles: ["jest-plugin-context/setup"]
};
require('dotenv').config({ path: __dirname + '/.env' });

module.exports = config;

// Or async function
module.exports = async() => {
    return {
        verbose: true,
    };
};