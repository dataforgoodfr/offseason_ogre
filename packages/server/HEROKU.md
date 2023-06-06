# Why heroku ?

- Heroku is a platform as a service (PaaS) that enables developers to build, run, and operate applications entirely in the cloud.
- Easy to configure + free plan. Heroku documentation is very clear and comprehensive, please check here: https://devcenter.heroku.com/
- Ogre Heroku project is located here : https://dashboard.heroku.com/pipelines/a4347218-0a61-413d-b009-6e43a58f872b

# Interact with Heroku

- Have a quick look at how heroku works : https://devcenter.heroku.com/articles/how-heroku-works
- First create a free Heroku account : https://signup.heroku.com/
- Make sure to be added to the team project by Gregory
- To manage an app, Heroku has a graphical interface + a command line interface. To install and use the CLI, check the documentation : https://devcenter.heroku.com/articles/heroku-cli#install-the-heroku-cli

# Deployment

- CAUTION this will destroy/erase the older version of the app on heroku
- To deploy the backend app
  - commit you current work to push to heroku
  - Go at root of project
  - `git subtree push --prefix server heroku master` : this will indicate to heroku that the backend application is located in the ./server directory. It will push the work of **your current branch** to heroku master branch
- see documentation : https://devcenter.heroku.com/categories/deployment

# Check latest logs and errors

`heroku logs --tail`

# Link heroku with local repo

`heroku git:remote -a atelierogre-staging`

# Troubleshooting

If the api is not responding to any requests, it may be because the Heroku router is not passing down the request. The error message in the Heroku logs would look like this:

```bash
2023-05-31T06:33:42.407994+00:00 heroku[router]: at=error code=H99 desc="Platform error" method=GET path="/api/users/logged-user" host=atelierogre-staging.herokuapp.com request_id=cfcbede1-fc9e-4278-ac7c-7c5264b3e4ae fwd="37.167.224.186" dyno= connect= service= status=503 bytes= protocol=https
```

Or like this:

```bash
2023-05-31T06:33:48.661017+00:00 heroku[router]: at=error code=H10 desc="App crashed" method=GET path="/api/users/logged-user" host=atelierogre-staging.herokuapp.com request_id=4212171e-d7bc-49da-a0ff-7ed0a95d27d5 fwd="37.167.224.186" dyno= connect= service= status=503 bytes= protocol=https
```

To solve the issue, run the commands:

```bash
# Disable sticky sessions
heroku features:disable http-session-affinity

# Remove all dynos
heroku ps:scale web=0

# Add new dynos
heroku ps:scale web=1

# Reactivate sticky session
heroku features:enable http-session-affinity
```
