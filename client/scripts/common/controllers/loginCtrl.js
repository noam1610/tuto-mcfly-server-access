'use strict';
require('lbServices');
var controllername = 'loginCtrl';

module.exports = function(app) {
    var fullname = app.name + '.' + controllername;
    /*jshint validthis: true */

    var deps = ['LoopBackAuth', '$auth', '$location', '$window'];

    function controller(LoopBackAuth, $auth, $location, $window) {
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

        };

        var activate = function() {

        };
        activate();
    }

    controller.$inject = deps;
    app.controller(fullname, controller);
};
