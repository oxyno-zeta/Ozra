/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 09/01/16
 * Licence: See Readme
 */

// Require
var _ = require('lodash');
var APIResponses = require('./core/APIResponses.js');
var APICodes = require('./core/APICodes.js');
var base = require('./base.js');
var databaseService = require('../../services/databaseService.js');
var configurationService = require('../../shared/configuration.js');
var securityBase = require('../../base/security.js');
var userModel = require('../../models/user.js');
var logger = require('../../shared/logger.js');

// Exports
module.exports = {
    systemsUrls: systemsUrls
};


// Functions


function systemsUrls(mainApp){
    // Put login api
    mainApp.post('/system/login/', login);
}


function login(req, res){
    // Get body
    var body = req.body;
    // Set default error
    var responseBody = APIResponses.getDefaultResponseBody();
    if (_.isUndefined(body.username) ||
        _.isNull(body.username) ||
        _.isEqual(body.username, '') ||
        _.isUndefined(body.password) ||
        _.isNull(body.password) ||
        _.isEqual(body.password, '')) {
        // Empty body
        logger.error('Login failed => Nothing in body => Stop');
        if (configurationService.isVerbose()){
            logger.debug(body);
        }
        APIResponses.sendResponse(res, responseBody, APICodes.clientErrors.BAD_REQUEST, false);
        return;
    }

    // Get user in database
    databaseService.getUserFromName(body.username).then(function(user){
        // Check it is right password
        securityBase.compare(body.password, user.getPassword()).then(function(result){
            // Check result
            if (!result){
                logger.error('Login failed => Wrong password => Stop');
                if (configurationService.isVerbose()){
                    logger.debug(body);
                }
                APIResponses.sendResponse(res, responseBody, APICodes.clientErrors.FORBIDDEN, false);
                return;
            }

            // Ok
            logger.info('Login Success for user "' + user.getName() + '"');

            responseBody.token = user.getToken();
            responseBody.userId = user.getId();

            APIResponses.sendResponse(res, responseBody, APICodes.normal.OK, true);
        }, function(err){
            logger.error('Login failed => Something failed... => Stop');
            if (configurationService.isVerbose()){
                // Debug
                logger.debug(err);
            }
            APIResponses.sendResponse(res, responseBody, APICodes.serverErrors.INTERNAL_ERROR, false);
            return;
        });
    }, function(err){
        if (err){
            logger.error('Login failed => Something failed... => Stop');
            if (configurationService.isVerbose()){
                // Debug
                logger.debug(err);
            }
            APIResponses.sendResponse(res, responseBody, APICodes.serverErrors.INTERNAL_ERROR, false);
            return;
        }

        logger.error('Login failed => User not found => Stop');
        if (configurationService.isVerbose()){
            logger.debug(body);
        }
        APIResponses.sendResponse(res, responseBody, APICodes.clientErrors.NOT_AUTHORIZED, false);
    });
}








