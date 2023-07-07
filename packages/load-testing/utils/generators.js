module.exports = {
  generateUserData,
};

function generateUserData(nb) {
  return {
    country: "FR",
    email: `ogre-${nb}@load-testing.com`,
    lastName: `Ogre Load Tester ${nb}`,
    firstName: `Ogre Load Tester ${nb}`,
  };
}
