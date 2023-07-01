const config = require("./config");

module.exports = {
  testConsumptionActionsLoad,
};

async function testConsumptionActionsLoad(page, context) {
  const userData = {
    email: context.vars.email,
    token: context.vars.token,
  };

  const localStorage = new LocalStorage(page);
  const navigator = new Navigator(page);

  await navigator.goToRootPage();
  await localStorage.setItem("token", userData.token);
  await navigator.refreshPage();

  await page.waitForURL(`${config.WEBSITE_URL}/play/my-games`);

  await navigator.goToPlayerActionPage();
  const checkboxes = page.getByRole("checkbox");

  for (let i = 0; i < 60; i++) {
    await checkboxes.nth(i % 5).click();
    await pause(1000);
  }
}

async function pause(durationInMs) {
  return new Promise((resolve) => setTimeout(resolve, durationInMs));
}

class Navigator {
  constructor(page) {
    this.page = page;
  }

  async goToPlayerActionPage() {
    await this.page.goto(
      `${config.WEBSITE_URL}/play/games/${config.GAME_ID}/persona/actions`
    );
  }

  async goToRootPage() {
    await this.page.goto(`${config.WEBSITE_URL}`);
  }

  async refreshPage() {
    await this.page.reload();
  }
}

class LocalStorage {
  constructor(page) {
    this.page = page;
  }

  async getItem(key) {
    const serializedLocalStorage = await this.page.evaluate(() =>
      JSON.stringify(window.localStorage)
    );
    const localStorage = JSON.parse(serializedLocalStorage);
    return localStorage?.[key] || null;
  }

  async setItem(key, value) {
    await this.page.evaluate(
      ({ key, value }) => {
        localStorage.setItem(key, value);
      },
      { key, value }
    );
  }
}
