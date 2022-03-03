
# Install heroku
# connect to heroku CLI
`heroku login`

# push backend to heroku
- CAUTION this will destroy/erase the older version on heroku
- Go at root of project
- `git subtree push --prefix server heroku master`

# Check errors
`heroku logs --tail`

# Link heroku with local repo
`heroku git:remote -a atelierogre-staging`
