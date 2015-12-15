/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 08/12/15
 * Licence: See Readme
 */

// Require
var promise = require('promise');
var APICodes = require('./core/APICodes.js');
var APIResponses = require('./core/APIResponses.js');
var logger = require('../../shared/logger.js');
var databaseService = require('../../services/databaseService.js');

// Exports
module.exports = {
    apiTokenSecurity: apiTokenSecurity,
    isUserAdministrator: isUserAdministrator
};

// Functions
/**
 * Security function for api
 * @param req {object} Express request
 * @param res {object} Express response
 * @returns {promise}
 */
function apiTokenSecurity(req, res){
    return new promise(function(resolve, reject){
        // Get the user token
        var token = req.query['token'];

        // Prepare the response to default
        var body = APIResponses.getDefaultResponseBody(token);

        // Check if the token exist
        if (token === undefined) {
            logger.error('No token => stop');
            APIResponses.sendResponse(res, body, APICodes.clientErrors.NOT_AUTHORIZED, false);
            reject();
            return;
        }

        // Check if this is right token
        databaseService.getUserFromToken(token).then(function(user){
            // Success
            resolve(user);
        }, function(error){
            // Error
            logger.error('User unknown => not authorized');
            APIResponses.sendResponse(res, body, APICodes.clientErrors.FORBIDDEN, false);
            reject(error);
        });
    });
}

/**
 * Is user administrator ?
 * @param user
 * @returns {promise} resolve true|false when admin, reject if something wrong
 */
function isUserAdministrator(user){
    return new promise(function(resolve, reject){
        databaseService.getGroupsFromIds(user.getGroups()).then(function(groups){
            var i;
            for (i = 0; i < groups.length; i++){
                if (groups[i].isAdministrator()){
                    resolve(true);
                    return;
                }
            }

            resolve(false);
        }, reject);
    });
}

