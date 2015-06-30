# tuto-mcfly-server-access

## The project 

In this tutorial we are going to add JWT support to loopback !

First we will create a server in which some objects will be secured (you must login to access them)
and others will be unsecured.

Then we will create a client in which some pages will be secured (you must login to access them)
and others will be unsecured.



## Server side

The server will be built with loopback.   
 
### Begining

Let's create a folder :
```Bash
mkdir tuto-mcfly-server-access
```


Then scaffold a loopback server :
```
slc loopback 
```

You can check it works :
```
slc run
```

### Creating some objects

Then we install mcfly-loopback :
```
npm install --save mcfly-io/mcfly-loopback
```

** VERIFY **
Don't forget not to hide user in model-config.json , add :

```JSON
"User": {
        "dataSource": "db",
        "public": true
    },
```

We need to attach our objects to a datasource :
```
slc loopback:datasource
```

You can choose in memory / mongo / etc...

### Security : From AccessToken to JWT

Go to server/boot/authentication.js
```javascript
var mcflyLoopback = require('mcfly-loopback');
var config = require('../auth-config');

module.exports = function enableAuthentication(server) {
 // enable authentication
 server.enableAuth();
 mcflyLoopback.oauth(server, config);
};
```

Let's create a new file server/auth-config.js  

```javascript
module.exports = {
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
In order to handle **ACL** run `scl loopback:acl` and secure the entity for deniying everyone and authorizing only authenticated users.



More details about ACLs [here](http://docs.strongloop.com/display/public/LB/Model+definition+JSON+file;jsessionid=96C4FBE779BE4B9E9E79EE47F3C19411#ModeldefinitionJSONfile-ACLs)

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
       "principalType": "ROLE",
       "principalId": "$authenticated",
       "permission": "ALLOW"
   }],
   "methods": []
}
```


####To conclude try if it works:
```
slc run
```
And go to localhost:3000/explorer.

## Client side

In this tutorial we are going to create a client in which some pages will be secured (you must login to access them)
and others will be unsecured.  

### First steps

We first need to create a folder :
```Bash
mkdir tuto-mcfly-client-access
cd tuto-mcfly-client-access
```

Then we use the generator:
```
yo mcfly
```

You will have to set an array of choices :
![capture d ecran 2015-06-29 a 11 15 24](https://cloud.githubusercontent.com/assets/8570784/8403789/587f31e2-1e50-11e5-9ab4-de5d66989c1c.png)

To check that everything works :
```
gulp browsersync
```
This command should open the a web page with your client code ( now empty )

### Building our app

First we create a module:
```
yo mcfly:module common
```

This will create you two files. In the terminal you will see :
```bash
create oauth-loopback/scripts/common/index.js
create oauth-loopback/scripts/common/views/home.html
```

Now let's create a `login.html` page in `scripts/common/views`
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

Now let's create a controller :  
```
yo mcfly:controller common loginCtrl
```

Then we need to add it as a route in `scripts/common/index.js`.  
```javascript
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
                controller: fullname + '.loginCtrl as vm'
            });
        }
    ]);
```

In the google log in button add the vm.authenticate method:
```html
<div class="col">
    <button ng-click="vm.authenticate('google')" class="button button-assertive">
              Google
    </button>
</div>
```
** SIMPLIFY THIS TO A SERVICE IN mcfly-loopback **
Now let's define it in the controller: loginCtrl.js
```javascript
var deps = ['LoopBackAuth', '$auth', '$location', '$window'];

    function controller(LoopBackAuth, $auth, $location, $window) {
        var vm = this;
        vm.controllername = fullname;

        vm.authenticate = function(provider) {
            $auth
                .authenticate(provider)
                .then(function(response) {
                    var accessToken = response.data;
                    LoopBackAuth.setUser(accessToken.id, accessToken.userId, accessToken.user);
                    LoopBackAuth.rememberMe = true;
                    LoopBackAuth.save();
                    return response.resource;
                });
        };
```
** SIMPLIFY THIS **
Add this to index.js in order to deal with the authentification:
```Javascript
app.config(['$stateProvider', '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider) {
            function authenticated($q, $location, User) {
                var deferred = $q.defer();
                var isAuthenticated = User.getCurrentId();
                if(!isAuthenticated) {
                    $location.path('/login');
                } else {
                    deferred.resolve('/secured');
                }
                return deferred.promise;
            }
            $urlRouterProvider.otherwise('/');
            $stateProvider.state('home', {
                url: '/',
                template: require('./views/home.html')
            });
            $stateProvider.state('login', {
                url: '/login',
                template: require('./views/login.html'),
                controller: fullname + '.loginCtrl as vm'
            });
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
```javascript
 vm.logout = function() {
    LoopBackAuth.clearUser();
    LoopBackAuth.save();
    $location.path('/');
}

```


#### Using Satellizer

```
npm install --save satellizer
```

** SIMPLIFY **
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

In the lbServices file we need to add the url of our server such as :
```
var urlBase = "http://localhost:3000/api";
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
```javascript
vm.cars = [{
            'name': 'ferrari'
        }, {
            'name': 'mazda'
        }];

vm.getCars = function() {
            Car.create([{
                  'name': 'play'
                }, {
                  'name': 'gogol'
                }])
                .$promise
                .then(function() {
                    return Car.find({});
                })
                .then(function(cars) {
                  vm.cars = cars;
                });
        
        };
```

Now in index.js we need to add our route for the secured page :
```javascript
$stateProvider.state('secured', {
                url: '/secured',
                template: require('./views/secured.html'),
                controller: fullname + '.securedCtrl as vm',
                resolve: {
                    authenticated: authenticated
                }
            });
```



***********

#### Adding some require

In several files don't forget to add require and deps

##### loginCtrl
```
require('lbServices');
``

##### securedCtrl
```
require('lbServices');
```
&

```
    var deps = ['Car'];
    function controller(Car) {
```
##### index

```Javascript
require('angular-ui-router');
require('angular-ionic');
require('ng-cordova');
require('satellizer');
require('lbServices');

var modulename = 'common';

module.exports = function(namespace) {

    var fullname = namespace + '.' + modulename;

    var angular = require('angular');
    var app = angular.module(fullname, ['satellizer', 'lbServices', 'ui.router', 'ionic', 'ngCordova']);
    // inject:folders start
    require('./controllers')(app);
    // inject:folders end
```
