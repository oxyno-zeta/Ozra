/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 15/04/16
 * Licence: See Readme
 */

/* ************************************* */
/* ********       REQUIRE       ******** */
/* ************************************* */
var _ = require('lodash');
var APIResponses = require('../routes/api/core/APIResponses');
var APICodes = require('../routes/api/core/APICodes');
var logger = require('../shared/logger');
var configurationService = require('../shared/configuration');
var userDaoService = require('../dao/userDaoService');
var groupDaoService = require('../dao/groupDaoService');

/* ************************************* */
/* ********       EXPORTS       ******** */
/* ************************************* */
module.exports = {
    middleware: {
        ozraTokenMiddleware: ozraTokenMiddleware,
        ozraRequireAdminMiddleware: ozraRequireAdminMiddleware
    },
    isUserAdministrator: isUserAdministrator,
    isGroupLastAdministrator: isGroupLastAdministrator
};

/* ************************************* */
/* ********  PRIVATE FUNCTIONS  ******** */
/* ************************************* */



/* ************************************* */
/* ********   PUBLIC FUNCTIONS  ******** */
/* ************************************* */

/**
 * Middleware to get user from token and reject if error
 * @returns {Function}
 */
function ozraTokenMiddleware(){
    return function(req, res, next){
        // Get the user token
        var token = req.query['token'];

        // Prepare the response to default
        var body = APIResponses.getDefaultResponseBody(token);

        // Check if the token exist
        if (_.isUndefined(token)) {
            logger.error('No token => stop');
            APIResponses.sendResponse(res, body, APICodes.clientErrors.NOT_AUTHORIZED, false);
            return;
        }

        // Check if this is right token
        userDaoService.getUserFromToken(token).then(function(user){
            // Success

            // Store user in request
            req.user = user;

            // Log
            logger.info('User "' + user.getName() + '" authenticated');

            next();
        }, function(){
            // Error
            logger.error('User unknown => not authorized');
            APIResponses.sendResponse(res, body, APICodes.clientErrors.FORBIDDEN, false);
        });
    };
}

/**
 * Require Administrator role middleware
 * Reject if user is not administator
 * @returns {Function}
 */
function ozraRequireAdminMiddleware(){
    return function(req, res, next){
        // Get use
        var user = req.user;

        // Prepare the response to default
        var body = APIResponses.getDefaultResponseBody(user.getToken());

        isUserAdministrator(user).then(function(isAdmin){
            // Check if user is administrator
            if (isAdmin){
                next();
                return;
            }

            // Not admin
            logger.error('Require administrator middleware failed => User "' + user.getName() +
                '" not administrator => Stop');
            APIResponses.sendResponse(res, body, APICodes.clientErrors.FORBIDDEN, false);
        }, function(err){
            logger.error('Something failed in require administrator middleware... => Stop');
            if (configurationService.isVerbose()){
                // Debug
                logger.debug(err);
            }
            APIResponses.sendResponse(res, body, APICodes.serverErrors.INTERNAL_ERROR, false);
        });
    };
}

/**
 * Check if user is administator
 * @param user
 * @returns {Promise}
 */
function isUserAdministrator(user){
    return new Promise(function(resolve, reject){
        groupDaoService.getGroupsFromIds(user.getGroups()).then(function(groups) {
            var i;
            for (i = 0; i < groups.length; i++) {
                if (groups[i].isAdministrator()) {
                    resolve(true);
                    return;
                }
            }

            resolve(false);
        }, reject);
    });
}

/**
 * Check if group is last administrator group
 * @param group {groupModel}
 * @returns {Promise} (resolve: false if not last administrator, true if last administrator, reject: error)
 */
function isGroupLastAdministrator(group){
    return new Promise(function(resolve, reject){
        groupDaoService.getAllGroups().then(function(groups){
            // Remove group from result to find
            groups = _.remove(groups, function(element){
                return !_.isEqual(element.getId(), group.getId());
            });

            // Check if it still exist a administrator group
            var i;
            for (i = 0; i < groups.length; i++){
                if (groups[i].isAdministrator()){
                    resolve(false);
                    return; // Stop here
                }
            }

            resolve(true);
        }, reject);
    });
}

