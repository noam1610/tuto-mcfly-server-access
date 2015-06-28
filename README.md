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


We then need to create a server :
```
slc loopback 
```

You can check it works :
```
slc run
```

### Creating some objects

Now we will create the BaseUser (unsecured) object in the server.  
Download **https://github.com/cosmojs/universal** and copy the common folder into your folder.


Then we install mcfly-loopback :
```
npm install --save mcfly-io/mcfly-loopback
```

In order to add BaseUser to our server go to model-config.json and add :

```JSON
"BaseUser": {
        "dataSource": "db",
        "public": true
    }
``

Don't forget to hide user 
```JSON
"User": {
        "dataSource": "db",
        "public": false
    },
```
We need to attach our objects to a datasource :
```
slc loopback:datasource
```

You can name it mongo and choose MongoDb.

### Security : From AccessToken to JWT

To pass to JWT : Go to server/boot/authentication.js
```Javascript
var mcflyLoopback = require('mcfly-loopback');
var config = require('../config');

module.exports = function enableAuthentication(server) {
 // enable authentication
 server.enableAuth();
 mcflyLoopback.oauth(server, config);
};
```


If we want the app to handle google, facebook etc.... let's create a new file server/config.js with
```JSON
module.exports = {
 mongoURI: process.env.MONGO_URI || 'localhost',
 userModel: process.env.USER_MODEL || 'BaseUser',
 authHeader: process.env.AUTH_HEADER || 'Satellizer',
 tokenSecret: process.env.TOKEN_SECRET || 'A hard to guess string',
 oauth: {
   facebook: {
     secret: process.env.FACEBOOK_SECRET || 'yourcode'
   },
   google: {
     secret: process.env.GOOGLE_SECRET || 'yourcode'
   }
}
}
```

### Adding an secured data
Create **Car** with loopback 
```
slc loopback:model Car
```

In the common/models/Car.js file change :
```JSON
{
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
```


### Some necessary tools

You may find some errors if running the server.  
To prevent it run :  

```
npm install loopback-connector-mongodb
npm install mcfly-io/mcfly-loopback
```




























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















