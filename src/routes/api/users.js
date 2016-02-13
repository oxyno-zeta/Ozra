/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 16/12/15
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
    usersUrls: usersUrls
};

// Functions
/**
 * Users Urls
 * @param mainApp {object} Main Express application
 */
function usersUrls(mainApp){
    // Get all users
    mainApp.get('/users/', getAllUsers);
    // Get specific user
    mainApp.get('/users/:id', getUser);
    // Add user
    mainApp.post('/users/', addUser);
    // Delete user
    mainApp.delete('/users/:id', deleteUser);
    // Modify a user
    mainApp.put('/users/:id', modifyUser);
    // Modify user password
    mainApp.put('/users/:id/password', modifyUserPassword);
}

/**
 * Get all users
 * @param req
 * @param res
 */
function getAllUsers(req, res){
    base.apiTokenSecurity(req, res).then(function(user){
        // Success
        var token = user.getToken();
        // Get default response body
        var responseBody = APIResponses.getDefaultResponseBody(token);
        // Log
        logger.info('User "' + user.getName() + '" authenticated');

        // Check if user is administrator
        base.isUserAdministrator(user).then(function(isAdmin){
            if (!isAdmin){
                logger.error('Get all users failed => Not an administrator => Stop');
                APIResponses.sendResponse(res, responseBody, APICodes.clientErrors.FORBIDDEN, false);
                return;
            }

            databaseService.getAllUsers().then(function(users){
                var usersArray = [];
                _.forEach(users, function(user){
                    usersArray.push(user.toAPIJson());
                });

                // Add Users
                responseBody.users = usersArray;

                // Log
                logger.info('Get all users => ok');

                // Log users if verbose activated
                if (configurationService.isVerbose()){
                    logger.debug(usersArray);
                }

                // Response
                APIResponses.sendResponse(res, responseBody, APICodes.normal.OK, true);
            }, function(err){
                logger.error('Get all users failed => Something failed... => Stop');
                if (configurationService.isVerbose()){
                    // Debug
                    logger.debug(err);
                }
                APIResponses.sendResponse(res, responseBody, APICodes.serverErrors.INTERNAL_ERROR, false);
            });
        }, function(err){
            logger.error('Get all users failed => Something failed... => Stop');
            if (configurationService.isVerbose()){
                // Debug
                logger.debug(err);
            }
            APIResponses.sendResponse(res, responseBody, APICodes.serverErrors.INTERNAL_ERROR, false);
        });
    });
}

/**
 * Get specific user from id
 * @param req
 * @param res
 */
function getUser(req, res){
    base.apiTokenSecurity(req, res).then(function(user){
        // Success
        var token = user.getToken();
        // Get default response body
        var responseBody = APIResponses.getDefaultResponseBody(token);
        // User id
        var userId = req.params.id;
        // Log
        logger.info('User "' + user.getName() + '" authenticated');

        base.isUserAdministrator(user).then(function(isAdmin){
            // Check if data are correct
            if (!_.isEqual(user.getId(), userId) && !isAdmin){
                // Not good user
                logger.error('Get user failed => Id and token don\'t correspond to same user ' +
                '(not admin request) => Stop');
                APIResponses.sendResponse(res, responseBody, APICodes.clientErrors.FORBIDDEN, false);
                return;
            }

            // Return for non admin user
            if (!isAdmin) {
                // Return user
                responseBody.user = user.toAPIJson();

                logger.info('Get user "' + user.getName() + '" => ok');
                APIResponses.sendResponse(res, responseBody, APICodes.normal.OK, true);
                return;
            }

            databaseService.getUserFromId(userId).then(function(user){
                // Return user
                responseBody.user = user.toAPIJson();

                logger.info('Get user "' + user.getName() + '" => ok');
                APIResponses.sendResponse(res, responseBody, APICodes.normal.OK, true);
            }, function(err){
                logger.error('Get user failed => Not found => Stop');
                if (configurationService.isVerbose()){
                    // Debug
                    logger.debug(err);
                }
                APIResponses.sendResponse(res, responseBody, APICodes.clientErrors.NOT_FOUND, false);
            });
        }, function(err){
            logger.error('Get user failed => Something failed... => Stop');
            if (configurationService.isVerbose()){
                // Debug
                logger.debug(err);
            }
            APIResponses.sendResponse(res, responseBody, APICodes.serverErrors.INTERNAL_ERROR, false);
        });
    });
}

/**
 * Add user
 * @param req
 * @param res
 */
function addUser(req, res){
    base.apiTokenSecurity(req, res).then(function(user){
        // Success
        var token = user.getToken();
        // Get default response body
        var responseBody = APIResponses.getDefaultResponseBody(token);
        // Body
        var body = req.body;
        // Log
        logger.info('User "' + user.getName() + '" authenticated');

        // Check is data are valid
        // Check password before hash
        if (!_.isString(body.password) || _.isUndefined(body.password)||
            _.isNull(body.password) || _.isEqual(body.password, '')){
            logger.error('Add user failed => Data not valid (no password) => Stop');
            if (configurationService.isVerbose()){
                logger.debug(body);
            }
            APIResponses.sendResponse(res, responseBody, APICodes.clientErrors.FORBIDDEN, false);
            return;
        }
        // Generate user
        var salt = securityBase.genSaltSync();
        var newUser = new userModel.User()
            .setName(body.name)
            .setToken(securityBase.genTokenSync())
            .setPassword(securityBase.genHashSync(body.password, salt))
            .setSalt(salt)
            .setGroups(body.groups);

        // Check data are ok
        if (!newUser.isFullValid()){
            logger.error('Add user failed => Data not valid (data error) => Stop');
            if (configurationService.isVerbose()){
                logger.debug(newUser.toAPIJson());
            }
            APIResponses.sendResponse(res, responseBody, APICodes.clientErrors.FORBIDDEN, false);
            return;
        }

        databaseService.getGroupsFromIds(newUser.getGroups()).then(function(){
            // Groups found => ok

            // Check if user if admin
            base.isUserAdministrator(user).then(function(isAdmin){
                if (!isAdmin){
                    logger.error('Add user failed => Not an administrator => Stop');
                    APIResponses.sendResponse(res, responseBody, APICodes.clientErrors.FORBIDDEN, false);
                    return;
                }
                // Check if user already exist
                databaseService.getUserFromName(newUser.getName()).then(function(){
                    // User found => fail
                    logger.error('Add user failed => user "' + newUser.getName() + '" already exist => Stop');
                    if (configurationService.isVerbose()){
                        logger.debug(newUser.toAPIJson());
                    }
                    APIResponses.sendResponse(res, responseBody, APICodes.clientErrors.CONFLICT, false);
                }, function(err){
                    // Check if something wrong
                    if (err){
                        logger.error('Add user failed => Something failed... => Stop');
                        if (configurationService.isVerbose()){
                            // Debug
                            logger.debug(err);
                        }
                        APIResponses.sendResponse(res, responseBody, APICodes.serverErrors.INTERNAL_ERROR, false);
                        return;
                    }

                    // Nothing found => ok


                    // Add user in database
                    databaseService.put(newUser.toJson()).then(function(){
                        logger.info('Add user "' + newUser.getName() + '" success');

                        // Add user
                        responseBody.user = newUser.toAPIJson();

                        // Debug
                        if (configurationService.isVerbose()){
                            logger.debug(newUser.toAPIJson());
                        }

                        APIResponses.sendResponse(res, responseBody, APICodes.normal.CREATED, true);
                    }, function(err){
                        logger.error('Add user failed => Something failed... => Stop');
                        if (configurationService.isVerbose()){
                            // Debug
                            logger.debug(err);
                        }
                        APIResponses.sendResponse(res, responseBody, APICodes.serverErrors.INTERNAL_ERROR, false);
                    });
                });
            }, function(err){
                logger.error('Add user failed => Something failed... => Stop');
                if (configurationService.isVerbose()){
                    // Debug
                    logger.debug(err);
                }
                APIResponses.sendResponse(res, responseBody, APICodes.serverErrors.INTERNAL_ERROR, false);
            });
        }, function(err){
            logger.error('Add user failed => Data not valid (groups error) => Stop');
            if (configurationService.isVerbose()){
                logger.debug(newUser.toAPIJson());
                logger.debug(err);
            }
            APIResponses.sendResponse(res, responseBody, APICodes.clientErrors.FORBIDDEN, false);
        });
    });
}

/**
 * Delete user
 * @param req
 * @param res
 */
function deleteUser(req, res){
    base.apiTokenSecurity(req, res).then(function(user){
        // Success
        var token = user.getToken();
        // Get default response body
        var responseBody = APIResponses.getDefaultResponseBody(token);
        // Log
        logger.info('User "' + user.getName() + '" authenticated');

        // Check if data are valid
        var userId = req.params.id;
        if (!_.isString(userId)|| _.isUndefined(userId)|| _.isNull(userId)){
            // Id not valid
            logger.error('Delete user failed => data not valid => Stop');
            if (configurationService.isVerbose()){
                // Debug
                logger.debug(userId);
            }
            APIResponses.sendResponse(res, responseBody, APICodes.clientErrors.FORBIDDEN, false);
            return;
        }
        // Check if trying to remove own user
        if (_.isEqual(user.getId(), userId)){
            // Id not valid
            logger.error('Delete user failed => trying to delete own user => Stop');
            if (configurationService.isVerbose()){
                // Debug
                logger.debug(userId);
            }
            APIResponses.sendResponse(res, responseBody, APICodes.clientErrors.FORBIDDEN, false);
            return;
        }

        base.isUserAdministrator(user).then(function(isAdmin){
            if (!isAdmin){
                // Not admin
                logger.error('Delete user failed => User "' + user.getName() + '" not administrator => Stop');
                APIResponses.sendResponse(res, responseBody, APICodes.clientErrors.FORBIDDEN, false);
                return;
            }

            // Administrator user detected
            // Get user to remove
            databaseService.getUserFromId(userId).then(function(userFromId){
                // Got it => delete it
                databaseService.remove(userFromId.toJson()).then(function(){
                    // Done
                    logger.info('Delete user : "' + userFromId.getName() + '" done');
                    // Log user if verbose activated
                    if (configurationService.isVerbose()){
                        logger.debug(userFromId.toAPIJson());
                    }
                    APIResponses.sendResponse(res, responseBody, APICodes.normal.OK, true);
                }, function(err){
                    // Fail
                    logger.error('Delete user failed => Something failed... => Stop');
                    if (configurationService.isVerbose()){
                        // Debug
                        logger.debug(err);
                    }
                    APIResponses.sendResponse(res, responseBody, APICodes.serverErrors.INTERNAL_ERROR, false);
                });
            }, function(err){
                logger.error('Get all users failed => Something failed... => Stop');
                if (configurationService.isVerbose()){
                    // Debug
                    logger.debug(err);
                }
                APIResponses.sendResponse(res, responseBody, APICodes.serverErrors.INTERNAL_ERROR, false);
            });
        }, function(err){
            logger.error('Get all users failed => Something failed... => Stop');
            if (configurationService.isVerbose()){
                // Debug
                logger.debug(err);
            }
            APIResponses.sendResponse(res, responseBody, APICodes.serverErrors.INTERNAL_ERROR, false);
        });
    });
}

/**
 * Modify user
 * @warning Only administrators can modify users
 * @param req
 * @param res
 */
function modifyUser(req, res){
    base.apiTokenSecurity(req, res).then(function(user){
        // Success
        var token = user.getToken();
        // Get body
        var body = req.body;
        // Get default response body
        var responseBody = APIResponses.getDefaultResponseBody(token);
        // Log
        logger.info('User "' + user.getName() + '" authenticated');

        // Create data
        var userModified = new userModel.User()
            .setId(body.id)
            .setName(body.name)
            .setGroups(body.groups);

        base.isUserAdministrator(user).then(function(isAdmin){
            if (!isAdmin){
                // Not admin
                logger.error('Modification user failed => User "' + user.getName() + '" not administrator => Stop');
                APIResponses.sendResponse(res, responseBody, APICodes.clientErrors.FORBIDDEN, false);
                return;
            }

            // Check if data are valid
            if (!_.isEqual(req.params.id, body.id) || !userModified.isMinimumValid()){
                // Error
                logger.error('Modification user failed => data not valid => Stop');
                if (configurationService.isVerbose()){
                    // Debug
                    logger.debug(userModified.toAPIJson());
                }
                APIResponses.sendResponse(res, responseBody, APICodes.clientErrors.FORBIDDEN, false);
                return; // Stop here
            }

            // Check if groups are ok
            databaseService.getGroupsFromIds(userModified.getGroups()).then(function(){
                // Groups exists => ok

                // Function to follow
                function go(){
                    // Get modified user in db
                    databaseService.getUserFromId(userModified.getId()).then(function(userModifiedInDB){
                        // Set new information on user in db to put only new data in
                        userModifiedInDB
                            .setName(userModified.getName())
                            .setGroups(userModified.getGroups());
                        // Check if body contains password to crypt it
                        if ( !(_.isUndefined(body.password) || _.isNull(body.password) || !_.isString(body.password)) ){
                            // Password exist => need to hash it
                            var salt = userModifiedInDB.getSalt();
                            userModifiedInDB.setPassword(securityBase.genHashSync(body.password, salt));
                        }
                        // Put user modified in database
                        databaseService.put(userModifiedInDB.toJson()).then(function(){
                            // Ok
                            logger.info('Modification user "' + userModified.getName() + '" success !');
                            // Put user in response
                            responseBody.user = userModified.toAPIJson();
                            APIResponses.sendResponse(res, responseBody, APICodes.normal.OK, true);
                        }, function(err){
                            logger.error('Modification user failed => Something failed... => Stop');
                            if (configurationService.isVerbose()){
                                // Debug
                                logger.debug(err);
                            }
                            APIResponses.sendResponse(res, responseBody, APICodes.serverErrors.INTERNAL_ERROR, false);
                        });
                    }, function(err){
                        logger.error('Modification user failed => Something failed... => Stop');
                        if (configurationService.isVerbose()){
                            // Debug
                            logger.debug(err);
                        }
                        APIResponses.sendResponse(res, responseBody, APICodes.serverErrors.INTERNAL_ERROR, false);
                    });
                }

                // Check if new user name exist
                databaseService.getUserFromName(userModified.getName()).then(function(userInDB){
                    // User exist
                    // Check if it isn't the same user
                    if (!_.isEqual(userInDB.getId(), userModified.getId())){
                        // Not same user => fail
                        logger.error('Modification user failed => User "' + userModified.getName() +
                            '" already exist => Stop');
                        if (configurationService.isVerbose()){
                            // Debug
                            logger.debug(userModified.toAPIJson());
                        }
                        APIResponses.sendResponse(res, responseBody, APICodes.clientErrors.CONFLICT, false);
                        return;
                    }

                    // Same user => ok
                    go();
                }, function(){
                    // User doesn't exist => ok
                    go();
                });
            }, function(err){
                // Fail
                logger.error('Modification user failed => User groups doesn\'t exist => Stop');
                if (configurationService.isVerbose()){
                    // Debug
                    logger.debug(err);
                }
                APIResponses.sendResponse(res, responseBody, APICodes.clientErrors.NOT_FOUND, false);
            });
        }, function(err){
            logger.error('Modification user failed => Something failed... => Stop');
            if (configurationService.isVerbose()){
                // Debug
                logger.debug(err);
            }
            APIResponses.sendResponse(res, responseBody, APICodes.serverErrors.INTERNAL_ERROR, false);
        });
    });
}

/**
 * Modify a user password
 * @param req
 * @param res
 */
function modifyUserPassword(req, res){
    base.apiTokenSecurity(req, res).then(function(user){
        // Success
        var token = user.getToken();
        // Get body
        var body = req.body;
        // Get default response body
        var responseBody = APIResponses.getDefaultResponseBody(token);
        // Log
        logger.info('User "' + user.getName() + '" authenticated');

        base.isUserAdministrator(user).then(function(isAdmin){
            if (!isAdmin && !_.isEqual(body.id, user.getId()) ){
                // Not admin or not same user
                logger.error('Modification user password failed => User "' + user.getName() +
                    '" not administrator => Stop');
                APIResponses.sendResponse(res, responseBody, APICodes.clientErrors.FORBIDDEN, false);
                return;
            }

            // Admin or same user detected

            // Check if data are valid
            if (_.isUndefined(body.password) || _.isNull(body.password) || !_.isString(body.password)){
                // Error
                logger.error('Modification user password failed => data not valid => Stop');
                if (configurationService.isVerbose()){
                    // Debug
                    logger.debug(body);
                }
                APIResponses.sendResponse(res, responseBody, APICodes.clientErrors.FORBIDDEN, false);
                return; // Stop here
            }

            if (!_.isEqual(body.id, user.getId()) && !_.isEqual(req.params.id, body.id)){
                // Error
                logger.error('Modification user password failed => data not valid => Stop');
                if (configurationService.isVerbose()){
                    // Debug
                    logger.debug(body);
                }
                APIResponses.sendResponse(res, responseBody, APICodes.clientErrors.FORBIDDEN, false);
                return; // Stop here
            }

            // Password detected

            databaseService.getUserFromId(body.id).then(function(userInDB){
                // Change user password
                var salt = userInDB.getSalt();
                userInDB.setPassword(securityBase.genHashSync(body.password, salt));

                // Put user modified in database
                databaseService.put(userInDB.toJson()).then(function(){
                    // Ok
                    logger.info('Modification user password for "' + userInDB.getName() + '" success !');
                    // Put user in response
                    responseBody.user = userInDB.toAPIJson();
                    APIResponses.sendResponse(res, responseBody, APICodes.normal.OK, true);
                }, function(err){
                    logger.error('Modification user failed => Something failed... => Stop');
                    if (configurationService.isVerbose()){
                        // Debug
                        logger.debug(err);
                    }
                    APIResponses.sendResponse(res, responseBody, APICodes.serverErrors.INTERNAL_ERROR, false);
                });
            }, function(err){
                logger.error('Modification user password failed => User id not found in database => Stop');
                if (configurationService.isVerbose()){
                    // Debug
                    logger.debug(err);
                }
                APIResponses.sendResponse(res, responseBody, APICodes.clientErrors.NOT_FOUND, false);
            });
        }, function(err){
            logger.error('Modification user password failed => Something failed... => Stop');
            if (configurationService.isVerbose()){
                // Debug
                logger.debug(err);
            }
            APIResponses.sendResponse(res, responseBody, APICodes.serverErrors.INTERNAL_ERROR, false);
        });
    });
}
