# SERVER SIDE GUIDELINES

# Run & play with application locally

1. Set default value in .env `yarn env:default`

2. You can chose either to run the application using docker or by launching yourself the application in local and taking care of the dependencies and DB creation

## Run app manually

1. Install dependencies using yarn : `yarn install`

2. Setup database - launch a postGre docker container with `yarn db:up`

3. Create the database tables: `yarn db:migrate`

4. `yarn db:seed` (Optional)

5. Test the server

- make sure you have created the database
- Start the server: `yarn dev`. Server will be accessible on port 8080.

## Run app from build

`yarn build` to transpile ts into js (will be emitted in ./built)
`yarn start`

# Play with app

Once the app is launched it is accessible on port 8080 : http://localhost:8080/

# Deployment of the app on staging (and soon production!)

The backend application is hosted for testing on Heroku. Please refer to `server/HEROKU.md` to see how to interact with heroku and deployment.
