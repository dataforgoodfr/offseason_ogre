SERVER SIDE README.md

# En local

- langage utilisé : javascript avec node.js https://nodejs.org/en/
- framework de l'application utilisé : express https://expressjs.com/fr
    - structure de l'application
    - module de routage

modules npm à installer
- installation du package npm : `npm init y`
- modules express (framework), pg (interagir avec une bdd postgres), dotenv (gestion variables d'environnement) : `npm i express pg dotenv`


Interagir avec la BDD Postgresql => passage à l'utilisation de l'ORM sequelize
- Installer postgres sur son ordinateur (sous windows/wsl, mac ou linux)
- Confirmez l’installation et récupérez le numéro de version : `psql --version`
- Exécuter la base de donnée : `sudo service postgresql start` (pour vérifier l’état de la BDD : `sudo service postgresql status` et pour arrêter l’exécution : `sudo service postgresql stop`) (sinon on reçoit une erreur `Error: connect ECONNREFUSED`)
- pour l'instant création de la BDD automatiquement avec sequelize au lancement du server node
- [OLD] Créer la BDD : exécuter le fichier create_db.sql avec le super utilisateur postgres : `sudo -u postgres psql -f server/create_db.sql`

Interagir / tester le serveur
- Créer un fichier .env en copiant le fichier .env.example
- S'assurer d'avoir exécuté postgresql et d'avoir créé la DB
- lancer un serveur : `node server/index.js`. le serveur sera accessible sur le port 3000
- interaction : 
    - soit utiliser un navigateur internet : http://localhost:3000/
    - soit utiliser un logiciel pouvant faire des requêtes à une api (insomnia  https://docs.insomnia.rest/, postman ou équivalent)

Doc :
- Variables d'environnement : https://www.npmjs.com/package/dotenv
- Base de données
    - doc psql (interaction DB avec la ligne de commande): https://www.postgresql.org/docs/14/app-psql.html
    - doc connexion node - postgresql : https://node-postgres.com/features/connecting

# With docker

- Install docker on you computer (https://docs.docker.com/get-docker/)

- Check if the docker service is running

```sh
sudo service docker status
```

- Copy .env.example file into .env file
```sh
cp server/.env.example server/.env
```

- Edit .env file

    ```PG_URL=postgresql://default_user:default_user@localhost:5432/ogre```

    into :

    ````PG_URL=postgresql://postgres:postgres@database:5432/ogre```

- Then you run docker-compose 
```sh
docker-compose up --build
```
You can add -d at the end to run docker-compose as detached then to stop it you just need to do

```sh
docker-compose --down
```

## Run tests

Start docker-compose

```sh
docker-compose up --build
```

then run tests

```sh
yarn test --coverage  --collectCoverageFrom="./app/**"
```

Args

|                                  |                                                           |
|--------------------------------- |:---------------------------------------------------------:|
| --coverage                       |   tells to jest to run test coverage                      |
| --collectCoverageFrom="./app/**" | tells to jest where he need to look at for tests coverage |

