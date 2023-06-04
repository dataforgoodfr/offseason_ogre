#!/bin/sh

echo "HEROKU_APP_NAME = $HEROKU_APP_NAME"
echo "HEROKU_PR_NUMBER = $HEROKU_PR_NUMBER"

# Set env var
curl --location --request PATCH "https://api.heroku.com/apps/$HEROKU_APP_NAME/config-vars" \
--header "Authorization: Bearer $HEROKU_API_TOKEN" \
--header 'Accept: application/vnd.heroku+json; version=3' \
--header 'Content-Type: application/json' \
--data "{
    \"WEB_APP_URL\": \"https://deploy-preview-$HEROKU_PR_NUMBER--atelierogre-staging.netlify.app\"
}"

# Restart dynos
curl --location --request DELETE "https://api.heroku.com/apps/$HEROKU_APP_NAME/dynos" \
--header "Authorization: Bearer $HEROKU_API_TOKEN" \
--header 'Accept: application/vnd.heroku+json; version=3'
