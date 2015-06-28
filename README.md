# tuto-mcfly-server-access

## The project 

In this tutorial we are going to create a server in which some objects will be secured (you must login to access them)
 and others will be unsecured.

The server will be built with loopback. 

## Server side

### Begining

We first need to create a folder :
```Bash
mkdir tuto-mcfly-server-access
```


We first need to create a server :


Create server : slc loopback // slc run

copier commun depuis universal

npm install --save mcfly-io/nomdutrucgithub

slc loopback:datasource


To pass to JWT : Go to server/boot/athenti.. 
```

    var mcflyLoopback = require('mcfly-loopback');
var config = require('../config');

module.exports = function enableAuthentication(server) {
 // enable authentication
 server.enableAuth();
 mcflyLoopback.oauth(server, config);
};
```


Dans config , il y a les codes des sites insta...fb...    

create new file config.js with
module.exports = {
 mongoURI: process.env.MONGO_URI || 'localhost',
 userModel: process.env.USER_MODEL || 'BaseUser',
 authHeader: process.env.AUTH_HEADER || 'Satellizer',
 tokenSecret: process.env.TOKEN_SECRET || 'A hard to guess string',
 oauth: {
   facebook: {
     secret: process.env.FACEBOOK_SECRET || '7c47eea04e2d7ac867e07fb66a1c9162'
   },
   google: {
     secret: process.env.GOOGLE_SECRET || '6dNoAwqznF-7eV6WTR120y10'
   }
}
}


Ajouter BaseUser à loopback
et à model-config

"BaseUser": {
        "dataSource": "db",
        "public": true

    }


On cache user dans model config

"public": false

postman.com

Créer Car via loopback model et dans son json mettre {
   "name": "Car",
   "base": "PersistedModel",
   "idInjection": true,
   "options": {
       "validateUpsert": true
   },
   "properties": {
       "name": {
           "type": "string"
       }
   },
   "validations": [],
   "relations": {},
   "acls": [{
       "principalType": "ROLE",
       "principalId": "$everyone",
       "permission": "DENY"
   }, {
       "accessType": "READ",
       "principalType": "ROLE",
       "principalId": "$authenticated",
       "permission": "ALLOW"
   }],
   "methods": []
}


npm install loopback-connector-mongodb

npm install mcfly-io/mcfly-loopback





























On crée le folder client ouath-app
yo mcfly ouath-app
On crée un module avec le generator
yo mcfly:module common
yo mcfly:controller common login
gulp browsersyncl


cf wiki

bower install satellizer
In package.json add satellizer in browser  

Dans login.js passer satellizer en parametre de la fonction

ajouter scope en param de la fonction

lb-ng to build a file

lbServices à ajouter à scrips c'est le fichier qui permet de communiquer avec le server depuis le client

AJouter bodyparser poour loopback c'est un middlewear















