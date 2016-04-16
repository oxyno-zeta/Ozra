/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 14/04/16
 * Licence: See Readme
 */

/* ************************************* */
/* ********       REQUIRE       ******** */
/* ************************************* */
var _ = require('lodash');
var APIResponses = require('../routes/api/core/APIResponses.js');
var APICodes = require('../routes/api/core/APICodes.js');
var configurationService = require('../shared/configuration.js');
var logger = require('../shared/logger.js');
var userDaoService = require('../dao/userDaoService');
var securityWrapperService = require('../wrappers/securityWrapperService');

/* ************************************* */
/* ********       EXPORTS       ******** */
/* ************************************* */
module.exports = {
    api: {
        login: login
    }
};

/* ************************************* */
/* ********  PRIVATE FUNCTIONS  ******** */
/* ************************************* */



/* ************************************* */
/* ********   PUBLIC FUNCTIONS  ******** */
/* ************************************* */

/**
 * Login
 * @param body
 * @returns {Promise}
 */
function login(body){
    return new Promise(function(resolve, reject){
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
            reject({
                status: APICodes.clientErrors.BAD_REQUEST
            });
            return;
        }

        // Get user in database
        userDaoService.getUserFromName(body.username).then(function(user){
            // Check it is right password
            securityWrapperService.compare(body.password, user.getPassword()).then(function(result){
                // Check result
                if (!result){
                    logger.error('Login failed => Wrong password => Stop');
                    if (configurationService.isVerbose()){
                        logger.debug(body);
                    }
                    reject({
                        status: APICodes.clientErrors.FORBIDDEN
                    });
                    return;
                }

                // Ok
                logger.info('Login Success for user "' + user.getName() + '"');

                var data = {
                    token: user.getToken(),
                    userId: user.getId()
                };

                resolve({
                    status: APICodes.normal.OK,
                    data: data
                });
            }, function(err){
                logger.error('Login failed => Something failed... => Stop');
                if (configurationService.isVerbose()){
                    // Debug
                    logger.debug(err);
                }
                reject({
                    status: APICodes.serverErrors.INTERNAL_ERROR
                });
            });
        }, function(err){
            if (err){
                logger.error('Login failed => Something failed... => Stop');
                if (configurationService.isVerbose()){
                    // Debug
                    logger.debug(err);
                }
                reject({
                    status: APICodes.serverErrors.INTERNAL_ERROR
                });
                return;
            }

            logger.error('Login failed => User not found => Stop');
            if (configurationService.isVerbose()){
                logger.debug(body);
            }
            reject({
                status: APICodes.clientErrors.NOT_AUTHORIZED
            });
        });
    });
}
