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

Now we will create the BaseUser (secured) object in the server.  
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
```



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
This is the way we store data.  
(You can see below in config.js that we choosed a local storage. However, you can use mongolab).

If you used mongo, don't forget to install it :
```
npm install loopback-connector-mongodb
```


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

Let's create a new file server/config.js  
```javascript
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


If we want the app to handle google, facebook etc.... Let's add :
```javascript
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

### Adding a secured data
Create **Car** with loopback 
```
slc loopback:model Car
```
This will generate a file common/models/Car.json  
In order to handle **access** add 

```JSON
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
```

More details about ACLs here  
[Here Loopback](http://docs.strongloop.com/display/public/LB/Model+definition+JSON+file;jsessionid=96C4FBE779BE4B9E9E79EE47F3C19411#ModeldefinitionJSONfile-ACLs)


Hence, the common/models/Car.json file should look like to this :
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
npm install mcfly-io/mcfly-loopback
```

### Compatibility with client

In server/server.js we need to add at the begining:  

```Javascript
var bodyParser = require('body-parser');

var app = module.exports = loopback();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
   extended: true
}));
```


## Client side

In this tutorial we are going to create a client in which some pages will be secured (you must login to access them)
and others will be unsecured.  

### First steps

We first need to create a folder :
```Bash
mkdir tuto-mcfly-client-access
```

Then we use the generator:
```
yo mcfly tuto-mcfly-client-access
```

You will have to set an array of choices :
![capture d ecran 2015-06-29 a 11 15 24](https://cloud.githubusercontent.com/assets/8570784/8403789/587f31e2-1e50-11e5-9ab4-de5d66989c1c.png)

If you have this error:  
![capture d ecran 2015-06-29 a 11 33 28](https://cloud.githubusercontent.com/assets/8570784/8404072/b538e782-1e52-11e5-9c85-f01a8c30f927.png)

Try this workaround:

In the project where the install failed you'll find a file named .gulps-package.json  
This file is generated before the generator tries to do an npm install in case it fails

So you can do the following:

  * copy the content of the devDependencies section of this file in the devDependencies of package.json  
  * modify the version of gulp-sass to be 2.0.2  
  * save the resulting package.json  
  * run npm install this should put you in the same state as if the generated succeeded  
  * let me know how it went  


To check that everything works :
```
gulp browsersync
```
This command should open the a web page with your client code ( now empty )


If you find this error :

![capture d ecran 2015-06-29 a 11 43 07](https://cloud.githubusercontent.com/assets/8570784/8404241/165881a2-1e54-11e5-8ceb-08b4d0d1d9ba.png)

Then do :
```
bower install
```

It should fix it.  


### Building our app

First we create a module:
```
yo mcfly:module common
```

This will create you two files. In the terminal you will see :
```
create oauth-loopback/scripts/common/index.js
create oauth-loopback/scripts/common/views/home.html
```

Now let's create a login.html page in scripts/common/views
Add a basic loginUI such as : (if you use ionic)
```html
<div style="padding: 4em;">
    <div class="bar bar-header bar-positive">
        <h1 class="title">Login Page</h1>
    </div>
    <div class="list list-inset" style="padding: 4em;">
        <label style="padding-horizontal: 10em;" class="item item-input">
            <input type="text" placeholder="email">
        </label>
        <label style="padding-horizontal: 10em;" class="item item-input">
            <input type="text" placeholder="password">
        </label>
    </div>
    <div class="row">
        <div class="col"> </div>
        <div class="col"> </div>
        <div class="col">
            <button class="button button-balanced">
              SIGN IN
            </button>
        </div>
        <div class="col">
            <button class="button button-assertive">
              Google
            </button>
        </div>
        <div class="col"> </div>
        <div class="col"> </div>
    </div>
</div>
```

Then we need to add it as a route.  
In common/index.js we have :
```Javascript
app.config(['$stateProvider', '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('/');
            $stateProvider.state('home', {
                url: '/',
                template: require('./views/home.html')
            });
        }
    ]);
```  

Add the login redirection :
```Javascript
app.config(['$stateProvider', '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('/');
            $stateProvider.state('home', {
                url: '/',
                template: require('./views/home.html')
            });
            $stateProvider.state('login', {
                url: '/login',
                template: require('./views/login.html')
            });
        }
    ]);
```

Now let's create a controller :  
```
yo mcfly:controller common
```
Here we call it loginCtrl.  

Then in scripts/index.js, add this controller :
```Javascript
app.config(['$stateProvider', '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('/');
            $stateProvider.state('home', {
                url: '/',
                template: require('./views/home.html')
            });
            $stateProvider.state('login', {
                url: '/login',
                template: require('./views/login.html'),
                controller: fullname + '.loginCtrl',
                controllerAs: 'vm'
            });
        }
    ]);
```

In the google log in button add :
```html
<div class="col">
    <button ng-click="vm.authenticate('google')" class="button button-assertive">
              Google
    </button>
</div>
```

Now let's define it in the controller: loginCtrl.js
```Javascript
var deps = ['LoopBackAuth', '$auth', '$location', '$window'];

    function controller(LoopBackAut, $auth, $location, $window) {
        var vm = this;
        vm.controllername = fullname;

        vm.authenticate = function(provider) {
            $auth
                .authenticate(provider)
                .then(function(response) {
                    console.log(response);
                    console.log('authenticate');
                    var accessToken = response.data;
                    LoopBackAuth.setUser(accessToken.id, accessToken.userId, accessToken.user);
                    LoopBackAuth.rememberMe = true;
                    LoopBackAuth.save();
                    return response.resource;
                });
        };
```

In the log out button add :
```html
<div class="col">
    <button ng-click="vm.logout()" class="button button-assertive">
              Logout
    </button>
</div>
```

Now let's define it in the controller: loginCtrl.js
```Javascript

 vm.logout = function() {
            LoopBackAuth.clearUser();
            LoopBackAuth.save();
            $location.path('/');
            $window.alert({
                content: 'You have been logged out',
                animoation: 'fadeZoomFadeDown',
                type: 'material',
                duration: 3
            });


```


####Using Satellizer

```
bower install --save satellizer
```

Add it as a dependency in package.json in browser :
```JSON
"browser": {
        "unitHelper": "./test/unit/unitHelper.js",
        "lbServices": "./oauth-loopback/scripts/lbServices.js",
        "ionic": "./bower_components/ionic/release/js/ionic.js",
        "angular-ionic": "./bower_components/ionic/release/js/ionic-angular.js",
        "satellizer": "./bower_components/satellizer/satellizer.js"
    },
```

In views/index.js add
```
app.config(['satellizer.config', '$authProvider', function(config, $authProvider) {

        config.authHeader = 'Authorization';
        config.httpInterceptor = false;

        $authProvider.facebook({
            clientId: '1006560576035222'
        });

        $authProvider.google({
            url: 'http://localhost:5000/auth/google',
            clientId: '1016231927503-ppk8to3202giceccao5cqf9rqobgncoe.apps.googleusercontent.com'
        });
    }]);

```

#### Using lbServices

Let's add the lbServices File :

From the server folder :
```
lb-ng server/server.js lbServices.js
```

Then copy it in the client folder into client/scripts
For me it was this
```
cp /Users/Noam/mcfly-server-app/mcfly-server/mcfly-server-app/lbServices.js /Users/Noam/mcfly-server-app/mcfly-app/client/scripts
```

#### Adding a secured page 

Let's create views/secured.html.


Because we want to show our Car object, this will look like to :  

```html
<div style="padding: 4em;">
    <div>Secured</div>
    <button ng-click="vm.getCars()">See cars</button>
    <div ng-repeat= "car in vm.cars">What a crazy car -->{{car.name}}<--</div>
</div>
```

Now let's create the controller :
```
yo mcfly:controller common
```
And name it securedCtrl.js

In this controller, let's define cars by default and a function to crete two cars and display it:
```Javascript
vm.cars = [{
            'name': 'ferrari'
        }, {
            'name': 'mazda'
        }];

vm.getCars = function() {
            Car.create({
                    'name': 'play'
                }).$promise
                .then(function(cars) {});
            Car.create({
                    'name': 'gogol'
                }).$promise
                .then(function(cars) {});

            Car.find({}).$promise
                .then(function(cars) {
                    console.log(cars);
                    vm.cars = cars;
                });
        };
```

Now in index.js we need to add our route for the secured page :
```Javascript
$stateProvider.state('secured', {
                url: '/secured',
                template: require('./views/secured.html'),
                controller: fullname + '.securedCtrl',
                controllerAs: 'vm',
                resolve: {
                    authenticated: authenticated
                }
            });
```











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









bodyParser





