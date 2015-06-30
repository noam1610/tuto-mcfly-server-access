'use strict';
var controllername = 'securedCtrl';
require('lbServices');

module.exports = function(app) {
    var fullname = app.name + '.' + controllername;
    /*jshint validthis: true */

    var deps = ['Car'];

    function controller(Car) {
        var vm = this;
        vm.controllername = fullname;
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
        var activate = function() {

        };
        activate();
    }

    controller.$inject = deps;
    app.controller(fullname, controller);
};
