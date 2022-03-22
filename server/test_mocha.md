##Test API
###tests passés sous Mocha + Chai + Sinon.

Tests POST / UPDATE / DELETE: WIP.

Installation

> cd server
yarn add mocha --dev && yarn add chai --dev

De plus, il sera nécessaire d'installer les modules suivants:

> yarn add should --dev && yarn add request --dev

Execution

> yarn run test

ou

> ./node_modules/.bin/mocha

Pour executer les tests il est nécessaire d'utiliser l'IP du container dans le .env

> docker inspect database | grep "IPAddress"

puis remplacer "database" par l'adresse IP dans le fichier .env

