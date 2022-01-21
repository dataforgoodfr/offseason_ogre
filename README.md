# offseason_ogre

Présentation workshop OGRE : https://laconsciencedesetudiants.fr/atelier-ogre/

Goal : Develop a plateform for digitalize OGRE's workshop (sensitization of energy orders of magnitude)

## Features

- List all players

## Tech

OGRE uses a number of open source projects to work properly:

- [node.js] - evented I/O for the backend
- [Express] - fast node.js network app framework
- [Docker] - dockerize the app in  dev environment

## Installation

OGRE requires [Docker](https://www.docker.com/) v20+ to run.

## Development

Want to contribute ? Great!

For the server please read [server](https://github.com/dataforgoodfr/offseason_ogre/blob/develop/server/README.md) documentation

First Tab:

```sh
docker-compose up --build
```

Second Tab:

```sh
docker-compose exec -T database psql -U postgres ogre < server/create_db.sql
```

(optional) Third:

To test if it's work

```sh
cd server/
yarn test
```

When you have finish to implement your feature, run:
```sh
yarn test --coverage  --collectCoverageFrom="./app/**"
```

To check if tests pass and have at least 90%


## License

The project is under MIT licence. For more informations please read [LICENCE](https://github.com/dataforgoodfr/offseason_ogre/blob/develop/LICENSE) file

**Free Software, Hell Yeah!**
