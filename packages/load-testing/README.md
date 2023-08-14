# Load testing

Load testing helps find out bugs and parts of the application that needs to be optimized.

Tests are implemented on top of [Artillery](https://www.artillery.io/docs) and [AWS ECS](https://us-east-1.console.aws.amazon.com/ecs/v2/clusters?region=us-east-1) to run them at scale.

Ask a developer to get access to the AWS account of Atelier OGRE.

<p align="center">
  <img alt="Artillery" src="./docs/artillery.png">
&nbsp; &nbsp; &nbsp; &nbsp;
  <img alt="AWS ECS" src="./docs/aws-ecs.png">
</p>

# Tests

## Websocket load testing

### Scenario

Simulate a significant amount of users (200+) choosing consumption actions at the same time.

Each user lauches a dedicated browser, logs to the application and connects to the same game. Once on the game page, a user plays with consumption action to generate interactions and data transfers.

### Setup

For the test to work, follow the setup instructions:

1. Create a game.
1. Configure the file `config.js` with the right data.
1. Create test users in database:

```bash
node ./packages/load-testing/scripts/create-users.js
```

4. Generate test users credentials (valid for 30 days by default):

```bash
node ./packages/load-testing/scripts/generate-users-credentials.js
```

This will create a `credentials.csv` file next to the tests.

5. Register test users to the game you created:

```bash
node ./packages/load-testing/scripts/register-users-to-game.js
```

6. In the admin dashboard, assign players to teams and launch the game. Make sure to have the first step of the game active so the test players can select consumption actions.

The test is now all set. 🚀

### Run

On Fargate:

```bash
npx artillery run:fargate --region us-east-1 --count 35 --output ./packages/load-testing/websocket-load-testing-report.json ./packages/load-testing/websocket-load-testing.yml
```

Or locally:

```bash
npx artillery run --output ./packages/load-testing/websocket-load-testing-report.json ./packages/load-testing/websocket-load-testing.yml
```

Once completed, generate the `html` report using:

```bash
npx artillery report ./packages/load-testing/websocket-load-testing-report.json
```

You can now open the `html` report in your browser.
