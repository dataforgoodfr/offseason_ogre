# OGRE

## OGRE workshop presentation

Ogre is a recreational workshop to help understand orders of magnitude of energies and what it implies for the ecological transition.

https://laconsciencedesetudiants.fr/atelier-ogre/

## Goal of this project

Our goal is to develop a web application to digitalize OGRE's workshop. It will improve the user experience and allow to scale up the reach of the workshop.

## Tech

OGRE uses a number of open source projects to work properly:

- Backend
  - **Node.js** - a JavaScript runtime
  - **Express** - a web framework for node.js
- Frontend
  - **React** - a JavaScript library for building user interfaces

## Development

Node, yarn and Docker must be installed locally.

1. Run "yarn env:default" from root, it will set then default values in the file at /packages/server/.env
2. Run "yarn install" from root, it will install all dependencies in all workspaces
3. Run "yarn prepare" to initialize husky. 
4. Run "yarn db:up" from root, it will launch a container running a postGre database
5. Run "yarn db:migrate" from root, it creates the tables in the database (must be run on a new database or after a schema change)
6. Run "yarn workspace ogre-server db:generate" to generate the Prisma client from schema.
7. Run "yarn workspace ogre-server dev" to launch server
8. In another shell run "yarn workspace ogre-client dev" to launch client

## Deployment

The app can be deployed to heroku.

The "start" and "build" script are executed by default: https://help.heroku.com/P5IMU3MP/heroku-node-js-build-script-change-faq

A postGreSQL database is required, the connection string must be set as DATABASE_URL in the secrets.

A procfile is needed to run the PRISMA migrations.

https://github.com/prisma/prisma-examples/tree/latest/deployment-platforms/heroku
https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-heroku

### Testing the production build locally

Node, yarn and Docker must be installed locally.

1. Run "yarn env:default" from root, it will set default .env values in server
2. Run "yarn install" from root, it will install all dependencies in all workspaces
3. Run "yarn build" from root, it will transpile all typescript in all workspaces
4. Run "yarn db:up" from root, it will launch a postGre container
5. Run "yarn db:migrate" from root, it creates the tables in the database
6. Run "yarn start" from root

App should be up at http://localhost:8080/

## Tickets and issues

If you don't have access yet to this [board](https://ogre-d4g.atlassian.net/jira/software/c/projects/D4G/boards/4) please request access to admin.

Then chose an issue and there you go!

## License

The project is under MIT license. For more information please read [LICENSE](https://github.com/dataforgoodfr/offseason_ogre/blob/master/LICENSE) file
