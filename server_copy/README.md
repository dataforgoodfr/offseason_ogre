SERVER SIDE README.md

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