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
