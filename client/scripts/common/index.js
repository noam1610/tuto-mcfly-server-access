'use strict';
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
                controller: fullname + '.loginCtrl',
                controllerAs: 'vm'
            });
            $stateProvider.state('secured', {
                url: '/secured',
                template: require('./views/secured.html'),
                controller: fullname + '.securedCtrl',
                controllerAs: 'vm',
                resolve: {
                    authenticated: authenticated
                }
            });
        }
    ]);

    app.config(['satellizer.config', '$authProvider', function(config, $authProvider) {

        config.authHeader = 'Authorization';
        config.httpInterceptor = false;

        $authProvider.facebook({
            clientId: '1006560576035222'
        });

        $authProvider.google({
            url: 'http://localhost:3000/auth/google',
            clientId: '1016231927503-ppk8to3202giceccao5cqf9rqobgncoe.apps.googleusercontent.com'
        });
    }]);

    return app;
};
