/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 07/12/15
 * Licence: See Readme
 */

// Require
var express = require('express');
var router = express.Router();
var errorsAPI = require('./api/errors.js');
var groupsAPI = require('./api/groups.js');
var usersAPI = require('./api/users.js');
var actionsAPI = require('./api/actions.js');

// Exports
module.exports = {
    putApiRoutes: putApiRoutes
};

// Functions

/**
 * Put API Routes
 * @param mainApp {object} Main express application
 */
function putApiRoutes(mainApp){
    // Groups urls
    groupsAPI.groupsUrls(router);

    // Users urls
    usersAPI.usersUrls(router);

    // Actions urls
    actionsAPI.actionsUrls(router);

    // Errors urls
    errorsAPI.errorUrls(router);

    // Put api routes
    mainApp.use('/api', router);
}

