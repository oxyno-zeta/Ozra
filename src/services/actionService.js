/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 13/04/16
 * Licence: See Readme
 */

/* ************************************* */
/* ********       REQUIRE       ******** */
/* ************************************* */
var _ = require('lodash');
var APIResponses = require('../routes/api/core/APIResponses');
var APICodes = require('../routes/api/core/APICodes');
var securityService = require('./securityService');
var configurationService = require('../services/configurationService');
var logger = require('../shared/logger');
var executionWrapperService = require('../wrappers/executionWrapperService');
var groupDaoService = require('../dao/groupDaoService');
var actionDaoService = require('../dao/actionDaoService');
var actionModel = require('../models/action');

/* ************************************* */
/* ********       EXPORTS       ******** */
/* ************************************* */
module.exports = {
    api: {
        getAll: getAll,
        getFromId: getFromId,
        run: run,
        add: add,
        remove: remove,
        modify: modify
    }
};

/* ************************************* */
/* ********  PRIVATE FUNCTIONS  ******** */
/* ************************************* */



/* ************************************* */
/* ********   PUBLIC FUNCTIONS  ******** */
/* ************************************* */

/**
 * Get all actions
 * @param user
 * @returns {Promise}
 */
function getAll(user){
    return new Promise(function(resolve, reject){
        // Check if user is administrator
        securityService.isUserAdministrator(user).then(function(isAdmin){
            function success(actions){
                var actionsArray = [];
                _.forEach(actions, function(action){
                    actionsArray.push(action.toAPIJson());
                });

                // Log
                logger.info('Get all actions => success');

                // Log actions if verbose activated
                logger.debug(actionsArray);

                // Response
                resolve({
                    status: APICodes.normal.OK,
                    data: actionsArray
                });
            }

            function error(err){
                logger.error('Get all actions failed => Something failed... => Stop');
                logger.debug(err);
                reject({
                    status: APICodes.serverErrors.INTERNAL_ERROR
                });
            }


            // Check if user is administrator
            if (isAdmin){
                // Administrator detected => get all actions
                actionDaoService.getAllActions().then(success, error);
            }
            else {
                // Not administrator => get only user actions
                actionDaoService.getActionsFromGroupIds(user.getGroups()).then(success, error);
            }
        }, function(err){
            logger.error('Get all actions failed => Something failed... => Stop');
            logger.debug(err);
            reject({
                status: APICodes.serverErrors.INTERNAL_ERROR
            });
        });
    });
}

/**
 * Get action from id
 * @param user
 * @param id
 * @returns {Promise}
 */
function getFromId(user, id){
    return new Promise(function(resolve, reject){
        securityService.isUserAdministrator(user).then(function(isAdmin){
            actionDaoService.getActionFromId(id).then(function (action){
                if (!isAdmin) { // Administrator can get every actions
                    // Not administrator user detected

                    // Check if user if authorized to see this action
                    var authorized = false;
                    var actionGroups = action.getGroups();
                    var userGroups = user.getGroups();
                    var i;
                    for (i = 0; i < actionGroups.length; i++) {
                        authorized = _.includes(userGroups, actionGroups[i]);
                        if (authorized) {
                            break;
                        }
                    }

                    if (!authorized) {
                        // Stop here => not authorized => Forbidden
                        logger.error('Get action failed => Not in user groups => Stop');
                        reject({
                            status: APICodes.clientErrors.FORBIDDEN
                        });
                        return;
                    }
                }

                // Ok
                logger.info('Get action "' + action.getName() + '" success !');

                resolve({
                    status: APICodes.normal.OK,
                    data: action.toAPIJson()
                });
            }, function(err){
                logger.error('Get action failed => Not found => Stop');
                logger.debug(err);
                reject({
                    status: APICodes.clientErrors.NOT_FOUND
                });
            });
        }, function(err){
            logger.error('Get action failed => Something failed... => Stop');
            logger.debug(err);
            reject({
                status: APICodes.serverErrors.INTERNAL_ERROR
            });
        });
    });
}

/**
 * Run action on server
 * @param user
 * @param id
 * @returns {Promise}
 */
function run(user, id){
    return new Promise(function(resolve, reject){
        securityService.isUserAdministrator(user).then(function(isAdmin){
            function go(){
                actionDaoService.getActionFromId(id).then(function(action){
                    // Success
                    function finish(result){
                        logger.debug(result);
                        resolve({
                            status: APICodes.normal.OK,
                            data: result
                        });
                    }

                    executionWrapperService.exec(action.getScript()).then(function(result){
                        logger.info('Run action "' + action.getName() + '" success');
                        finish(result);
                    }, function(result){
                        logger.error('Run action "'+ action.getName() + '" failed => Execution error');
                        finish(result);
                    });
                }, function(err){
                    logger.error('Run action failed => action not found or something failed... => Stop');
                    logger.debug(err);
                    reject({
                        status: APICodes.clientErrors.NOT_FOUND
                    });
                });
            }

            if (isAdmin){
                // Admin user => continue
                go();
                return;
            }

            actionDaoService.getActionsFromGroupIds(user.getGroups()).then(function(actions){
                var i, actionInDB;
                for (i = 0; i < actions.length; i++){
                    if (_.isEqual(id, actions[i].getId())){
                        actionInDB = actions[i];
                        break; // Stop loop
                    }
                }

                // Check if action is found
                if (_.isUndefined(actionInDB)){
                    // Error
                    logger.error('Run action failed => Action id "' + id + '" not found for this user => Stop');
                    reject({
                        status: APICodes.clientErrors.NOT_FOUND
                    });
                    return;
                }

                // Continue
                go();
            });
        }, function(err){
            logger.error('Deleted action failed => Something failed... => Stop');
            logger.debug(err);
            reject({
                status: APICodes.serverErrors.INTERNAL_ERROR
            });
        });
    });
}

/**
 * Add action
 * @param user
 * @param actionData
 * @returns {Promise}
 */
function add(user, actionData){
    return new Promise(function(resolve, reject){
        // Data
        var newAction = actionModel.Action()
            .setName(actionData.name)
            .setCategory(actionData.category)
            .setScript(actionData.script)
            .setGroups(actionData.groups);

        // Set application if defined (not an obligation)
        if (!_.isUndefined(actionData.application)){
            newAction.setApplication(actionData.application);
        }

        // Check if data are valid
        if (!newAction.isValid()){
            logger.error('Add action failed => Data not valid (entries) => Stop');
            logger.debug(newAction.toJson());
            reject({
                status: APICodes.clientErrors.FORBIDDEN
            });
            return;
        }

        securityService.isUserAdministrator(user).then(function(isAdmin){
            // Check if groups exist
            groupDaoService.getGroupsFromIds(newAction.getGroups()).then(function(groups){
                if (!isAdmin) { // Administrator can add action without this verification
                    // Not administrator user detected

                    // Check if user if authorized to add this action with these groups
                    var authorized = false;
                    var actionGroups = newAction.getGroups();
                    var userGroups = user.getGroups();
                    var i;
                    for (i = 0; i < actionGroups.length; i++) {
                        authorized = _.includes(userGroups, actionGroups[i]);
                        if (!authorized) {
                            break;
                        }
                    }

                    // Check if data are valid
                    if (!authorized) {
                        logger.error('Add action failed => Data not valid (groups error) => Stop');
                        logger.debug(actionData);
                        reject({
                            status: APICodes.clientErrors.FORBIDDEN
                        });
                        return;
                    }
                }

                // Check that name not already exist
                actionDaoService.getActionFromCategory(newAction.getName(), newAction.getCategory()).then(function(){
                    // Error : found an action
                    logger.error('Add action failed => user "' + newAction.getName() + '" already exist => Stop');
                    logger.debug(newAction.toJson());
                    reject({
                        status: APICodes.clientErrors.CONFLICT
                    });
                }, function(err){
                    // Check if something wrong
                    if (err){
                        logger.error('Add action failed => Something failed... => Stop');
                        logger.debug(err);
                        reject({
                            status: APICodes.serverErrors.INTERNAL_ERROR
                        });
                        return;
                    }

                    // Not found => ok

                    actionDaoService.putAction(newAction.toJson()).then(function(){
                        logger.info('Add action "' + newAction.getName() + '" success');

                        // Debug
                        logger.debug(newAction.toJson());

                        resolve({
                            status: APICodes.normal.CREATED,
                            data: newAction.toAPIJson()
                        });
                    }, function(err){
                        logger.error('Add action failed => Something failed... => Stop');
                        logger.debug(err);
                        reject({
                            status: APICodes.serverErrors.INTERNAL_ERROR
                        });
                    });
                });
            }, function(err){
                logger.error('Add action failed => Data not valid (group not found) => Stop');
                logger.debug(err);
                reject({
                    status: APICodes.clientErrors.FORBIDDEN
                });
            });
        }, function(err){
            logger.error('Add actions failed => Something failed... => Stop');
            logger.debug(err);
            reject({
                status: APICodes.serverErrors.INTERNAL_ERROR
            });
        });
    });
}

/**
 * Remove action
 * @param user
 * @param id
 * @returns {Promise}
 */
function remove(user, id){
    return new Promise(function(resolve, reject){
        securityService.isUserAdministrator(user).then(function(isAdmin){
            function go(){
                actionDaoService.getActionFromId(id).then(function(actionInDB){
                    // Remove
                    actionDaoService.deleteAction(actionInDB.toJson()).then(function(success){
                        logger.info('Deleted action "' + actionInDB.getName() + '" => Success');
                        logger.debug(success);
                        resolve({
                            status: APICodes.normal.OK,
                            data: null
                        });
                    }, function(err){
                        logger.error('Deleted action failed => Something failed... => Stop');
                        logger.debug(err);
                        reject({
                            status: APICodes.serverErrors.INTERNAL_ERROR
                        });
                    });
                }, function(err){
                    logger.error('Delete action failed => action not found or something failed... => Stop');
                    logger.debug(err);
                    reject({
                        status: APICodes.clientErrors.NOT_FOUND
                    });
                });
            }

            if (isAdmin){
                // Not checking anything else => removing
                go();
                return;
            }

            actionDaoService.getActionsFromGroupIds(user.getGroups()).then(function(actions){
                var i, actionInDB;
                for (i = 0; i < actions.length; i++){
                    if (_.isEqual(id, actions[i].getId())){
                        actionInDB = actions[i];
                        break; // Stop loop
                    }
                }

                // Check if action is found
                if (_.isUndefined(actionInDB)){
                    // Error
                    logger.error('Deleted action failed => Action id "' + id + '" not found for this user => Stop');
                    reject({
                        status: APICodes.clientErrors.NOT_FOUND
                    });
                    return;
                }

                // Action found => ok
                go();
            }, function(err){
                logger.error('Deleted action failed => Cannot get actions for this user (from group ids) => Stop');
                logger.debug(err);
                reject({
                    status: APICodes.serverErrors.INTERNAL_ERROR
                });
            });
        }, function(err){
            logger.error('Deleted action failed => Something failed... => Stop');
            logger.debug(err);
            reject({
                status: APICodes.serverErrors.INTERNAL_ERROR
            });
        });
    });
}

/**
 * Modify action
 * @param user
 * @param actionData
 * @param id
 * @returns {Promise}
 */
function modify(user, actionData, id){
    return new Promise(function(resolve, reject){
        // Data
        var newAction = actionModel.Action()
            .setId(actionData.id)
            .setName(actionData.name)
            .setCategory(actionData.category)
            .setScript(actionData.script)
            .setGroups(actionData.groups);

        // Set application if defined (not an obligation)
        if (!_.isUndefined(actionData.application)){
            newAction.setApplication(actionData.application);
        }

        // Check if data are valid
        if (!newAction.isValid()){
            logger.error('Add action failed => Data not valid (entries) => Stop');
            logger.debug(newAction.toJson());
            reject({
                status: APICodes.clientErrors.FORBIDDEN
            });
            return;
        }

        securityService.isUserAdministrator(user).then(function(isAdmin){
            // Check if data are correct (same id in actionData and params) and data
            if (!_.isEqual(id, actionData.id) || !newAction.isValid()){
                // Error
                logger.error('Modification action failed => data not valid => Stop');
                logger.debug(newAction.toJson());
                reject({
                    status: APICodes.clientErrors.FORBIDDEN
                });
                return; // Stop here
            }


            groupDaoService.getGroupsFromIds(newAction.getGroups()).then(function(){
                // Groups ok

                // Function to continue with
                function go(){
                    // Function to continue with
                    function go2(){
                        actionDaoService.getActionFromId(newAction.getId()).then(function(result) {

                            // Update revision
                            newAction.setRevision(result.getRevision());

                            // Put in database
                            actionDaoService.putAction(newAction.toJson()).then(function (result) {
                                logger.info('Modification action success');
                                logger.debug(result);
                                resolve({
                                    status: APICodes.normal.OK,
                                    data: newAction.toAPIJson()
                                });
                            }, function (err) {
                                logger.error('Modification action failed => Something failed... => Stop');
                                logger.debug(err);
                                reject({
                                    status: APICodes.serverErrors.INTERNAL_ERROR
                                });
                            });
                        }, function(err){
                            logger.error('Modification action failed => Something failed... => Stop');
                            logger.debug(err);
                            reject({
                                status: APICodes.serverErrors.INTERNAL_ERROR
                            });
                        });
                    }

                    if (isAdmin){
                        // Administrator detected
                        go2();
                        return;
                    }

                    actionDaoService.getActionsFromGroupIds(user.getGroups()).then(function(actionsResult){
                        var result = _.find(actionsResult, function(action){
                            return (_.isEqual(action.getId(), newAction.getId()));
                        });

                        if (_.isUndefined(result)) {
                            // Error
                            logger.error('Modification action failed => Cannot find action for this user => Stop');
                            logger.debug(newAction.toJson());
                            reject({
                                status: APICodes.clientErrors.FORBIDDEN
                            });
                            return;
                        }
                        // Continue
                        go2();
                    }, function(err){
                        logger.error('Modification action failed => Something failed... => Stop');
                        logger.debug(err);
                        reject({
                            status: APICodes.serverErrors.INTERNAL_ERROR
                        });
                    });
                }

                actionDaoService.getActionFromCategory(newAction.getName(), newAction.getCategory())
                    .then(function(actionInDB){
                        if (!_.isEqual(newAction.getId(), actionInDB.getId())){
                            // Not same action => Failed
                            logger.error('Modification action failed => Same action name detected => Stop');
                            logger.debug(actionInDB.toJson());
                            logger.debug(newAction.toJson());
                            reject({
                                status: APICodes.clientErrors.FORBIDDEN
                            });
                            return;
                        }

                        go();
                    }, function(err){
                        // Check if something wrong
                        if (err){
                            logger.error('Modification action failed => Something failed... => Stop');
                            logger.debug(err);
                            reject({
                                status: APICodes.serverErrors.INTERNAL_ERROR
                            });
                            return;
                        }

                        go();
                    });
            }, function(){
                // Error
                logger.error('Modification action failed => data not valid (groups not found) => Stop');
                logger.debug(newAction.toJson());
                reject({
                    status: APICodes.clientErrors.FORBIDDEN
                });
            });
        }, function(err){
            logger.error('Modification action failed => Something failed... => Stop');
            logger.debug(err);
            reject({
                status: APICodes.serverErrors.INTERNAL_ERROR
            });
        });
    });
}
