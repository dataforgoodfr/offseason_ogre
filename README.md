# OGRE

## Présentation workshop OGRE

Ogre is a recreational workshop to help understand orders of magnitude of energies and what it implies for the ecological transition.

https://laconsciencedesetudiants.fr/atelier-ogre/

## Goal of this project

Our goal is to develop a web application to digitalize OGRE's workshop. It will improve the user experience and allow to scale up the reach of the workshop.

## Features

Work In Progress

## Tech

OGRE uses a number of open source projects to work properly:

- Backend
  - **node.js** - evented I/O for the backend
  - **Express** - fast node.js network app framework
  - **Docker** - dockerize the app in dev environment
- Frontend
  - **React** : Framework/library for front-end dev

## Development

Want to contribute ? Great!

### Running frontend and backend apps

Please refer to README.md in `/server` and `/client` folders.

## Deployment

The app can be deployed to heroku. A procfile is not needed as the "start" and "build" script are executed by default: https://help.heroku.com/P5IMU3MP/heroku-node-js-build-script-change-faq

A postGreSQL database is required, the connection string must be set as DATABASE_URL in the secrets.

### Testing deployment locally

Node, npm et Docker must be installed locally.

1. Copy the content of file `.env.example` into a new `.env` file

```sh
cp packages/server/.env.example packages/server/.env
```

2. Run "yarn install" from root
3. Run "yarn build" from root
4. Run "yarn db:up" from root
5. Run "yarn start" from root

App should be up at http://localhost:8080/

## Tickets and issues

If you don't have access yet to this [board](https://trello.com/b/pymIamFD/dev-web) please request access to admin.

Then chose an issue and there you go!

## License

The project is under MIT licence. For more informations please read [LICENCE](https://github.com/dataforgoodfr/offseason_ogre/blob/master/LICENSE) file
