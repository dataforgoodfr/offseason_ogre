##Test API
###tests passés sous Mocha + Chai + Sinon.

Tests POST / UPDATE / DELETE: WIP.

Installation

> cd server
npm i mocha --save-dev && npm i chai --save-dev

De plus, il sera nécessaire d'installer les modules suivants:

> npm i should --save-dev && npm i request --save-dev

Execution

> yarn run test

ou

> ./node_modules/.bin/mocha action

Pour executer les tests il est nécessaire d'utiliser l'IP du container dans le .env

> docker inspect database | grep "IPAddress"

puis remplacer "database" par l'adresse IP dans le fichier .env

