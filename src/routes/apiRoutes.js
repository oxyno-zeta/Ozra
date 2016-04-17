/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 07/12/15
 * Licence: See Readme
 */

/* ************************************* */
/* ********       REQUIRE       ******** */
/* ************************************* */
var express = require('express');
var router = express.Router();
var errorsAPI = require('./api/errors');
var groupsAPI = require('./api/groups');
var usersAPI = require('./api/users');
var actionsAPI = require('./api/actions');
var systemsAPI = require('./api/system');

/* ************************************* */
/* ********       EXPORTS       ******** */
/* ************************************* */
module.exports = {
    putApiRoutes: putApiRoutes
};

/* ************************************* */
/* ********  PRIVATE FUNCTIONS  ******** */
/* ************************************* */



/* ************************************* */
/* ********   PUBLIC FUNCTIONS  ******** */
/* ************************************* */

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

    // System urls
    systemsAPI.systemsUrls(router);

    // Errors urls
    errorsAPI.errorUrls(router);

    // Put api routes
    mainApp.use('/api', router);
}

