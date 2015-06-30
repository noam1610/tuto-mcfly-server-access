'use strict';

module.exports = function(app) {
    // inject:start
    require('./loginCtrl')(app);
    require('./securedCtrl')(app);
    // inject:end
};