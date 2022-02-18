# SERVER SIDE GUIDELINES

# Tech information

- langage utilisé : javascript avec node.js https://nodejs.org/en/
- framework de l'application utilisé : express https://expressjs.com/fr
    - structure de l'application
    - module de routage


# Run & play with application

1) Copy the content of file `.env.example` into a new `.env` file

```sh
cp server/.env.example server/.env
```

2) You can chose either to run the application using docker (easiest way, no dependencies to install on your computer) or by launching yourself the application in local and taking care of the dependencies and DB creation

## Run app with docker

- Install docker on you computer (https://docs.docker.com/get-docker/)

Requirement : [Docker](https://www.docker.com/) v20+


- Check if the docker service is running

```sh
sudo service docker status
```

- Then you may run docker-compose to launch the app
```sh
docker-compose up --build
```

- To stop the app : `Ctrl + c`

## Run app manualy

1) Edit .env file

```PG_URL=postgresql://postgres:postgres@localhost:5432/ogre```

into :

```PG_URL=postgresql://default_user:default_user@database:5432/ogre```

2) Install dependencies using yarn or npm : `npm i`

3) Setup database

- Installer `postgresql` sur son ordinateur
- Confirmez l’installation et récupérez le numéro de version : `psql --version`
- Exécuter la base de donnée : `sudo service postgresql start` (pour vérifier l’état de la BDD : `sudo service postgresql status` et pour arrêter l’exécution : `sudo service postgresql stop`) (sinon on reçoit une erreur `Error: connect ECONNREFUSED`)
- Création de la BDD automatiquement avec l'ORM sequelize au lancement du server node

4) Interagir / tester le serveur
- S'assurer d'avoir lancer postgresql et d'avoir créé la DB
- lancer un serveur : `node server/index.js`. le serveur sera accessible sur le port 8080

# Play with app

Once the app is launched it is accessible on port 8080 : http://localhost:8080/

# Run tests

Work In Progress (updates soon !)

# Useful documentation
- Docker : https://www.docker.com/
- Variables d'environnement : https://www.npmjs.com/package/dotenv
- Base de données
    - ORM Sequelize : https://sequelize.org/
    - doc psql (interaction DB avec la ligne de commande): https://www.postgresql.org/docs/14/app-psql.html
    - doc connexion node - postgresql : https://node-postgres.com/features/connecting
