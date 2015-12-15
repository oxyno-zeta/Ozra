/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 07/12/15
 * Licence: See Readme
 */

// Require
var errorsAPI = require('./api/errors.js');
var groupsAPI = require('./api/groups.js');

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
    // Put api routes

    // Groups urls
    groupsAPI.groupsUrls(mainApp);

    // Errors urls
    errorsAPI.errorUrls(mainApp);
}

