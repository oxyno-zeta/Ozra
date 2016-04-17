/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 07/04/16
 * Licence: See Readme
 */

/* ************************************* */
/* ********       REQUIRE       ******** */
/* ************************************* */
var _ = require('lodash');
var APIResponses = require('../routes/api/core/APIResponses');
var APICodes = require('../routes/api/core/APICodes');
var configurationService = require('../services/configurationService');
var logger = require('../shared/logger');
var userDaoService = require('../dao/userDaoService');
var groupDaoService = require('../dao/groupDaoService');
var securityService = require('./securityService');
var userModel = require('../models/user');
var securityWrapperService = require('../wrappers/securityWrapperService');

/* ************************************* */
/* ********       EXPORTS       ******** */
/* ************************************* */
module.exports = {
    api: {
        getAll: getAll,
        getFromId: getFromId,
        add: add,
        remove: remove,
        modifyUser: modifyUser,
        modifyUserPassword: modifyUserPassword
    }
};

/* ************************************* */
/* ********  PRIVATE FUNCTIONS  ******** */
/* ************************************* */



/* ************************************* */
/* ********   PUBLIC FUNCTIONS  ******** */
/* ************************************* */

/**
 * Get all users
 * @returns {Promise}
 */
function getAll(){
    return new Promise(function(resolve, reject){
        userDaoService.getAllUsers().then(function(users){
            var usersList = [];
            _.forEach(users, function(user){
                usersList.push(user.toAPIJson());
            });

            // Log
            logger.info('Get all users => ok');

            // Log users if verbose activated
            if (configurationService.isVerbose()){
                logger.debug(usersList);
            }

            // Response
            resolve({
                status: APICodes.normal.OK,
                data: usersList
            });
        }, function(err){
            logger.error('Get all users failed => Something failed... => Stop');
            if (configurationService.isVerbose()){
                // Debug
                logger.debug(err);
            }
            reject({
                status: APICodes.serverErrors.INTERNAL_ERROR
            });
        });
    });
}

/**
 * Get user from id
 * @param user
 * @param id
 * @returns {Promise}
 */
function getFromId(user, id){
    return new Promise(function(resolve, reject){
        securityService.isUserAdministrator(user).then(function(isAdmin){
            // Check if data are correct
            if (!_.isEqual(user.getId(), id) && !isAdmin){
                // Not good user
                logger.error('Get user failed => Id and token don\'t correspond to same user ' +
                    '(not admin request) => Stop');
                reject({
                    status: APICodes.clientErrors.FORBIDDEN
                });
                return;
            }

            // Return for non admin user
            if (!isAdmin) {
                // Return user
                logger.info('Get user "' + user.getName() + '" => ok');
                resolve({
                    status: APICodes.normal.OK,
                    data: user.toAPIJson()
                });
                return;
            }

            userDaoService.getUserFromId(id).then(function(user){
                // Return user
                logger.info('Get user "' + user.getName() + '" => ok');
                resolve({
                    status: APICodes.normal.OK,
                    data: user.toAPIJson()
                });
            }, function(err){
                logger.error('Get user failed => Not found => Stop');
                if (configurationService.isVerbose()){
                    // Debug
                    logger.debug(err);
                }
                reject({
                    status: APICodes.clientErrors.NOT_FOUND
                });
            });
        }, function(err){
            logger.error('Get user failed => Something failed... => Stop');
            if (configurationService.isVerbose()){
                // Debug
                logger.debug(err);
            }
            reject({
                status: APICodes.serverErrors.INTERNAL_ERROR
            });
        });
    });
}

/**
 * Add a user
 * @param user
 * @param userData
 * @returns {Promise}
 */
function add(user, userData){
    return new Promise(function(resolve, reject){
        // Check is data are valid
        // Check password before hash
        if (!_.isString(userData.password) || _.isUndefined(userData.password)||
            _.isNull(userData.password) || _.isEqual(userData.password, '')){
            logger.error('Add user failed => Data not valid (no password) => Stop');
            if (configurationService.isVerbose()){
                logger.debug(userData);
            }
            reject({
                status: APICodes.clientErrors.FORBIDDEN
            });
            return;
        }
        // Generate user
        var salt = securityWrapperService.genSaltSync();
        var newUser = new userModel.User()
            .setName(userData.name)
            .setToken(securityWrapperService.genTokenSync())
            .setPassword(securityWrapperService.genHashSync(userData.password, salt))
            .setSalt(salt)
            .setGroups(userData.groups);

        // Check data are ok
        if (!newUser.isFullValid()){
            logger.error('Add user failed => Data not valid (data error) => Stop');
            if (configurationService.isVerbose()){
                logger.debug(newUser.toAPIJson());
            }
            reject({
                status: APICodes.clientErrors.FORBIDDEN
            });
            return;
        }

        groupDaoService.getGroupsFromIds(newUser.getGroups()).then(function(){
            // Groups found => ok

            // Check if user already exist
            userDaoService.getUserFromName(newUser.getName()).then(function(){
                // User found => fail
                logger.error('Add user failed => user "' + newUser.getName() + '" already exist => Stop');
                if (configurationService.isVerbose()){
                    logger.debug(newUser.toAPIJson());
                }
                reject({
                    status: APICodes.clientErrors.CONFLICT
                });
            }, function(err){
                // Check if something wrong
                if (err){
                    logger.error('Add user failed => Something failed... => Stop');
                    if (configurationService.isVerbose()){
                        // Debug
                        logger.debug(err);
                    }
                    reject({
                        status: APICodes.serverErrors.INTERNAL_ERROR
                    });
                    return;
                }

                // Nothing found => ok


                // Add user in database
                userDaoService.putUser(newUser.toJson()).then(function(){
                    logger.info('Add user "' + newUser.getName() + '" success');

                    // Debug
                    if (configurationService.isVerbose()){
                        logger.debug(newUser.toAPIJson());
                    }

                    resolve({
                        status: APICodes.normal.CREATED,
                        data: newUser.toAPIJson()
                    });
                }, function(err){
                    logger.error('Add user failed => Something failed... => Stop');
                    if (configurationService.isVerbose()){
                        // Debug
                        logger.debug(err);
                    }
                    reject({
                        status: APICodes.serverErrors.INTERNAL_ERROR
                    });
                });
            });
        }, function(err){
            logger.error('Add user failed => Data not valid (groups error) => Stop');
            if (configurationService.isVerbose()){
                logger.debug(newUser.toAPIJson());
                logger.debug(err);
            }
            reject({
                status: APICodes.clientErrors.FORBIDDEN
            });
        });
    });
}

/**
 * Remove user from id
 * @param user
 * @param id
 * @returns {Promise}
 */
function remove(user, id){
    return new Promise(function(resolve, reject){
        // Check if data are valid
        if (!_.isString(id)|| _.isUndefined(id)|| _.isNull(id)){
            // Id not valid
            logger.error('Delete user failed => data not valid => Stop');
            if (configurationService.isVerbose()){
                // Debug
                logger.debug(id);
            }
            reject({
                status: APICodes.clientErrors.FORBIDDEN
            });
            return;
        }
        // Check if trying to remove own user
        if (_.isEqual(user.getId(), id)){
            // Id not valid
            logger.error('Delete user failed => trying to delete own user => Stop');
            if (configurationService.isVerbose()){
                // Debug
                logger.debug(id);
            }
            reject({
                status: APICodes.clientErrors.FORBIDDEN
            });
            return;
        }

        // Get user to remove
        userDaoService.getUserFromId(id).then(function(userFromId){
            // Got it => delete it
            userDaoService.deleteUser(userFromId.toJson()).then(function(){
                // Done
                logger.info('Delete user : "' + userFromId.getName() + '" done');
                // Log user if verbose activated
                if (configurationService.isVerbose()){
                    logger.debug(userFromId.toAPIJson());
                }
                resolve({
                    status: APICodes.normal.OK
                });
            }, function(err){
                // Fail
                logger.error('Delete user failed => Something failed... => Stop');
                if (configurationService.isVerbose()){
                    // Debug
                    logger.debug(err);
                }
                reject({
                    status: APICodes.serverErrors.INTERNAL_ERROR
                });
            });
        }, function(err){
            logger.error('Get all users failed => Something failed... => Stop');
            if (configurationService.isVerbose()){
                // Debug
                logger.debug(err);
            }
            reject({
                status: APICodes.serverErrors.INTERNAL_ERROR
            });
        });
    });
}

/**
 * Modify user data
 * @param user
 * @param userData
 * @param id
 * @returns {Promise}
 */
function modifyUser(user, userData, id){
    return new Promise(function(resolve, reject){
        // Create data
        var userModified = new userModel.User()
            .setId(userData.id)
            .setName(userData.name)
            .setGroups(userData.groups);

        // Check if data are valid
        if (!_.isEqual(id, userData.id) || !userModified.isMinimumValid()){
            // Error
            logger.error('Modification user failed => data not valid => Stop');
            if (configurationService.isVerbose()){
                // Debug
                logger.debug(userModified.toAPIJson());
            }
            reject({
                status: APICodes.clientErrors.FORBIDDEN
            });
            return; // Stop here
        }

        // Check if groups are ok
        groupDaoService.getGroupsFromIds(userModified.getGroups()).then(function(){
            // Groups exists => ok

            // Function to follow
            function go(){
                // Get modified user in db
                userDaoService.getUserFromId(userModified.getId()).then(function(userModifiedInDB){
                    // Set new information on user in db to put only new data in
                    userModifiedInDB
                        .setName(userModified.getName())
                        .setGroups(userModified.getGroups());
                    // Check if userData contains password to crypt it
                    if (!(
                            _.isUndefined(userData.password) ||
                            _.isNull(userData.password) ||
                            !_.isString(userData.password)
                        )){
                        // Password exist => need to hash it
                        var salt = userModifiedInDB.getSalt();
                        userModifiedInDB.setPassword(securityWrapperService.genHashSync(userData.password, salt));
                    }
                    // Put user modified in database
                    userDaoService.putUser(userModifiedInDB.toJson()).then(function(){
                        // Ok
                        logger.info('Modification user "' + userModified.getName() + '" success !');
                        resolve({
                            status: APICodes.normal.OK,
                            data: userModified.toAPIJson()
                        });
                    }, function(err){
                        logger.error('Modification user failed => Something failed... => Stop');
                        if (configurationService.isVerbose()){
                            // Debug
                            logger.debug(err);
                        }
                        reject({
                            status: APICodes.serverErrors.INTERNAL_ERROR
                        });
                    });
                }, function(err){
                    logger.error('Modification user failed => Something failed... => Stop');
                    if (configurationService.isVerbose()){
                        // Debug
                        logger.debug(err);
                    }
                    reject({
                        status: APICodes.serverErrors.INTERNAL_ERROR
                    });
                });
            }

            // Check if new user name exist
            userDaoService.getUserFromName(userModified.getName()).then(function(userInDB){
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
                    reject({
                        status: APICodes.clientErrors.CONFLICT
                    });
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
            reject({
                status: APICodes.clientErrors.NOT_FOUND
            });
        });
    });
}

/**
 * Modify user password
 * @param user
 * @param userData
 * @param id
 */
function modifyUserPassword(user, userData, id){
    return new Promise(function(resolve, reject){
        securityService.isUserAdministrator(user).then(function(isAdmin){
            if (!isAdmin && !_.isEqual(userData.id, user.getId()) ){
                // Not admin or not same user
                logger.error('Modification user password failed => User "' + user.getName() +
                    '" not administrator => Stop');
                reject({
                    status: APICodes.clientErrors.FORBIDDEN
                });
                return;
            }

            // Admin or same user detected

            // Check if data are valid
            if (_.isUndefined(userData.password) || _.isNull(userData.password) || !_.isString(userData.password)){
                // Error
                logger.error('Modification user password failed => data not valid => Stop');
                if (configurationService.isVerbose()){
                    // Debug
                    logger.debug(userData);
                }
                reject({
                    status: APICodes.clientErrors.FORBIDDEN
                });
                return; // Stop here
            }

            if (!_.isEqual(userData.id, user.getId()) && !_.isEqual(id, userData.id)){
                // Error
                logger.error('Modification user password failed => data not valid => Stop');
                if (configurationService.isVerbose()){
                    // Debug
                    logger.debug(userData);
                }
                reject({
                    status: APICodes.clientErrors.FORBIDDEN
                });
                return; // Stop here
            }

            // Password detected

            userDaoService.getUserFromId(userData.id).then(function(userInDB){
                // Change user password
                var salt = userInDB.getSalt();
                userInDB.setPassword(securityWrapperService.genHashSync(userData.password, salt));

                // Put user modified in database
                userDaoService.putUser(userInDB.toJson()).then(function(){
                    // Ok
                    logger.info('Modification user password for "' + userInDB.getName() + '" success !');
                    resolve({
                        status: APICodes.normal.OK,
                        data: userInDB.toAPIJson()
                    });
                }, function(err){
                    logger.error('Modification user failed => Something failed... => Stop');
                    if (configurationService.isVerbose()){
                        // Debug
                        logger.debug(err);
                    }
                    reject({
                        status: APICodes.serverErrors.INTERNAL_ERROR
                    });
                });
            }, function(err){
                logger.error('Modification user password failed => User id not found in database => Stop');
                if (configurationService.isVerbose()){
                    // Debug
                    logger.debug(err);
                }
                reject({
                    status: APICodes.clientErrors.NOT_FOUND
                });
            });
        }, function(err){
            logger.error('Modification user password failed => Something failed... => Stop');
            if (configurationService.isVerbose()){
                // Debug
                logger.debug(err);
            }
            reject({
                status: APICodes.serverErrors.INTERNAL_ERROR
            });
        });
    });
}

