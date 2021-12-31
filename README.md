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

Open your favorite Terminal and run these commands.

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
docker-compose exec server cat /etc/hosts // get the ip address
curl http://IP:3000/players
```

## License

The project is under MIT licence. For more informations please read [LICENCE](https://github.com/dataforgoodfr/offseason_ogre/blob/master/LICENSE) file

**Free Software, Hell Yeah!**
