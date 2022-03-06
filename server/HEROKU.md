
# Install heroku
# connect to heroku CLI
`heroku login`

# push backend to heroku
- CAUTION this will destroy/erase the older version on heroku
- Go at root of project
- `git subtree push --prefix server heroku master`

# Check latest logs and errors
`heroku logs --tail`

# Link heroku with local repo
`heroku git:remote -a atelierogre-staging`

# Migrating & seeding Heroku DB
- First login with heroku CLI
- `heroku run sequelize db:migrate`
- `heroku run sequelize db:seed:all`
