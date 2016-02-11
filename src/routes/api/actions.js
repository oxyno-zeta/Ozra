/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 24/12/15
 * Licence: See Readme
 */

// Require
var _ = require('lodash');
var APIResponses = require('./core/APIResponses.js');
var APICodes = require('./core/APICodes.js');
var base = require('./base.js');
var databaseService = require('../../services/databaseService.js');
var runService = require('../../services/runService.js');
var configurationService = require('../../shared/configuration.js');
var actionModel = require('../../models/action.js');
var logger = require('../../shared/logger.js');

// Exports
module.exports = {
    actionsUrls: actionsUrls
};

// Functions
/**
 * Users Urls
 * @param mainApp {object} Main Express application
 */
function actionsUrls(mainApp){
    // Get all actions
    mainApp.get('/actions/', getAllActions);
    // Get specific action
    mainApp.get('/actions/:id', getAction);
    // Get specific action
    mainApp.get('/actions/:id/run', runAction);
    // Add action
    mainApp.post('/actions/', addAction);
    // Delete action
    mainApp.delete('/actions/:id', deleteAction);
    // Modify a action
    mainApp.put('/actions/:id', modifyAction);
}

/**
 * Get all actions
 * @warning if user is admin, get all actions, if not, get all user actions (function of groups)
 * @param req
 * @param res
 */
function getAllActions(req, res){
    base.apiTokenSecurity(req, res).then(function(user){
        // Success
        var token = user.getToken();
        // Get default response body
        var responseBody = APIResponses.getDefaultResponseBody(token);
        // Log
        logger.info('User "' + user.getName() + '" authenticated');

        // Check if user is administrator
        base.isUserAdministrator(user).then(function(isAdmin){
            function success(actions){
                var actionsArray = [];
                _.forEach(actions, function(action){
                    actionsArray.push(action.toJson());
                });

                // Add Users
                responseBody.actions = actionsArray;

                // Log
                logger.info('Get all actions => success');

                // Log actions if verbose activated
                if (configurationService.isVerbose()){
                    logger.debug(actionsArray);
                }

                // Response
                APIResponses.sendResponse(res, responseBody, APICodes.normal.OK, true);
            }

            function error(err){
                logger.error('Get all actions failed => Something failed... => Stop');
                if (configurationService.isVerbose()){
                    // Debug
                    logger.debug(err);
                }
                APIResponses.sendResponse(res, responseBody, APICodes.serverErrors.INTERNAL_ERROR, false);
            }


            // Check if user is administrator
            if (isAdmin){
                // Administrator detected => get all actions
                databaseService.getAllActions().then(success, error);
            }
            else {
                // Not administrator => get only user actions
                databaseService.getActionsFromGroupIds(user.getGroups()).then(success, error);
            }
        }, function(err){
            logger.error('Get all actions failed => Something failed... => Stop');
            if (configurationService.isVerbose()){
                // Debug
                logger.debug(err);
            }
            APIResponses.sendResponse(res, responseBody, APICodes.serverErrors.INTERNAL_ERROR, false);
        });
    });
}

/**
 * Get specific action
 * @param req
 * @param res
 */
function getAction(req, res){
    base.apiTokenSecurity(req, res).then(function(user){
        // Success
        var token = user.getToken();
        // Get default response body
        var responseBody = APIResponses.getDefaultResponseBody(token);
        // Action id
        var actionId = req.params.id;
        // Log
        logger.info('User "' + user.getName() + '" authenticated');

        base.isUserAdministrator(user).then(function(isAdmin){
            databaseService.getActionFromId(actionId).then(function (action){
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
                        APIResponses.sendResponse(res, responseBody, APICodes.clientErrors.FORBIDDEN, false);
                        return;
                    }
                }

                // Ok
                logger.info('Get action "' + action.getName() + '" success !');

                // Put action
                responseBody.action = action.toJson();

                APIResponses.sendResponse(res, responseBody, APICodes.normal.OK, true);
            }, function(err){
                logger.error('Get action failed => Not found => Stop');
                if (configurationService.isVerbose()){
                    // Debug
                    logger.debug(err);
                }
                APIResponses.sendResponse(res, responseBody, APICodes.clientErrors.NOT_FOUND, false);
            });
        }, function(err){
            logger.error('Get action failed => Something failed... => Stop');
            if (configurationService.isVerbose()){
                // Debug
                logger.debug(err);
            }
            APIResponses.sendResponse(res, responseBody, APICodes.serverErrors.INTERNAL_ERROR, false);
        });
    });
}

/**
 * Execute Action
 * @param req
 * @param res
 */
function runAction(req, res){
    base.apiTokenSecurity(req, res).then(function(user){
        // Success
        var token = user.getToken();
        // Get default response body
        var responseBody = APIResponses.getDefaultResponseBody(token);
        // Action id
        var actionId = req.params.id;
        // Log
        logger.info('User "' + user.getName() + '" authenticated');

        base.isUserAdministrator(user).then(function(isAdmin){
            function go(){
                databaseService.getActionFromId(actionId).then(function(action){
                    // Success
                    function finish(result){
                        if (configurationService.isVerbose()){
                            logger.debug(result);
                        }
                        // Put result in body
                        responseBody.result = result;
                        // Respond
                        APIResponses.sendResponse(res, responseBody, APICodes.normal.OK, true);
                    }

                    runService.exec(action.getScript()).then(function(result){
                        logger.info('Run action "' + action.getName() + '" success');
                        finish(result);
                    }, function(result){
                        logger.error('Run action "'+ action.getName() + '" failed => Execution error');
                        finish(result);
                    });
                }, function(err){
                    logger.error('Run action failed => action not found or something failed... => Stop');
                    if (configurationService.isVerbose()){
                        // Debug
                        logger.debug(err);
                    }
                    APIResponses.sendResponse(res, responseBody, APICodes.clientErrors.NOT_FOUND, false);
                });
            }

            if (isAdmin){
                // Admin user => continue
                go();
                return;
            }

            databaseService.getActionsFromGroupIds(user.getGroups()).then(function(actions){
                var i, actionInDB;
                for (i = 0; i < actions.length; i++){
                    if (_.isEqual(actionId, actions[i].getId())){
                        actionInDB = actions[i];
                        break; // Stop loop
                    }
                }

                // Check if action is found
                if (_.isUndefined(actionInDB)){
                    // Error
                    logger.error('Run action failed => Action id "' + actionId +
                    '" not found for this user => Stop');
                    APIResponses.sendResponse(res, responseBody, APICodes.clientErrors.NOT_FOUND, false);
                    return;
                }

                // Continue
                go();
            });
        }, function(err){
            logger.error('Deleted action failed => Something failed... => Stop');
            if (configurationService.isVerbose()){
                // Debug
                logger.debug(err);
            }
            APIResponses.sendResponse(res, responseBody, APICodes.serverErrors.INTERNAL_ERROR, false);
        });
    });
}

/**
 * Add action
 * @param req
 * @param res
 */
function addAction(req, res){
    base.apiTokenSecurity(req, res).then(function(user){
        // Success
        var token = user.getToken();
        // Get default response body
        var responseBody = APIResponses.getDefaultResponseBody(token);
        // Get body
        var body = req.body;
        // Log
        logger.info('User "' + user.getName() + '" authenticated');
        // Data
        var newAction = actionModel.Action()
            .setName(body.name)
            .setCategory(body.category)
            .setScript(body.script)
            .setGroups(body.groups);

        // Set application if defined (not an obligation)
        if (!_.isUndefined(body.application)){
            newAction.setApplication(body.application);
        }

        // Check if data are valid
        if (!newAction.isValid()){
            logger.error('Add action failed => Data not valid (entries) => Stop');
            if (configurationService.isVerbose()){
                logger.debug(newAction.toJson());
            }
            APIResponses.sendResponse(res, responseBody, APICodes.clientErrors.FORBIDDEN, false);
            return;
        }

        base.isUserAdministrator(user).then(function(isAdmin){
            // Check if groups exist
            databaseService.getGroupsFromIds(newAction.getGroups()).then(function(groups){
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
                        if (configurationService.isVerbose()) {
                            logger.debug(body);
                        }
                        APIResponses.sendResponse(res, responseBody, APICodes.clientErrors.FORBIDDEN, false);
                        return;
                    }
                }

                // Check that name not already exist
                databaseService.getActionFromCategory(newAction.getName(), newAction.getCategory()).then(function(){
                    // Error : found an action
                    logger.error('Add action failed => user "' + newAction.getName() + '" already exist => Stop');
                    if (configurationService.isVerbose()){
                        logger.debug(newAction.toJson());
                    }
                    APIResponses.sendResponse(res, responseBody, APICodes.clientErrors.CONFLICT, false);
                }, function(err){
                    // Check if something wrong
                    if (err){
                        logger.error('Add action failed => Something failed... => Stop');
                        if (configurationService.isVerbose()){
                            // Debug
                            logger.debug(err);
                        }
                        APIResponses.sendResponse(res, responseBody, APICodes.serverErrors.INTERNAL_ERROR, false);
                        return;
                    }

                    // Not found => ok

                    databaseService.put(newAction.toJson()).then(function(){
                        logger.info('Add action "' + newAction.getName() + '" success');

                        // Add user
                        responseBody.action = newAction.toJson();

                        // Debug
                        if (configurationService.isVerbose()){
                            logger.debug(newAction.toJson());
                        }

                        APIResponses.sendResponse(res, responseBody, APICodes.normal.CREATED, true);
                    }, function(err){
                        logger.error('Add action failed => Something failed... => Stop');
                        if (configurationService.isVerbose()){
                            // Debug
                            logger.debug(err);
                        }
                        APIResponses.sendResponse(res, responseBody, APICodes.serverErrors.INTERNAL_ERROR, false);
                    });
                });
            }, function(err){
                logger.error('Add action failed => Data not valid (group not found) => Stop');
                if (configurationService.isVerbose()){
                    // Debug
                    logger.debug(err);
                }
                APIResponses.sendResponse(res, responseBody, APICodes.clientErrors.FORBIDDEN, false);
            });
        }, function(err){
            logger.error('Add actions failed => Something failed... => Stop');
            if (configurationService.isVerbose()){
                // Debug
                logger.debug(err);
            }
            APIResponses.sendResponse(res, responseBody, APICodes.serverErrors.INTERNAL_ERROR, false);
        });
    });
}

/**
 * Delete Action
 * @param req
 * @param res
 */
function deleteAction(req, res){
    base.apiTokenSecurity(req, res).then(function(user){
        // Success
        var token = user.getToken();
        // Get default response body
        var responseBody = APIResponses.getDefaultResponseBody(token);
        // Action id
        var actionId = req.params.id;
        // Log
        logger.info('User "' + user.getName() + '" authenticated');

        base.isUserAdministrator(user).then(function(isAdmin){
            function go(){
                databaseService.getActionFromId(actionId).then(function(actionInDB){
                    // Remove
                    databaseService.remove(actionInDB.toJson()).then(function(success){
                        logger.info('Deleted action "' + actionInDB.getName() + '" => Success');
                        if(configurationService.isVerbose()){
                            // Debug
                            logger.debug(success);
                        }
                        APIResponses.sendResponse(res, responseBody, APICodes.normal.OK, true);
                    }, function(err){
                        logger.error('Deleted action failed => Something failed... => Stop');
                        if (configurationService.isVerbose()){
                            // Debug
                            logger.debug(err);
                        }
                        APIResponses.sendResponse(res, responseBody, APICodes.serverErrors.INTERNAL_ERROR, false);
                    });
                }, function(err){
                    logger.error('Delete action failed => action not found or something failed... => Stop');
                    if (configurationService.isVerbose()){
                        // Debug
                        logger.debug(err);
                    }
                    APIResponses.sendResponse(res, responseBody, APICodes.clientErrors.NOT_FOUND, false);
                });
            }

            if (isAdmin){
                // Not checking anything else => removing
                go();
                return;
            }

            databaseService.getActionsFromGroupIds(user.getGroups()).then(function(actions){
                var i, actionInDB;
                for (i = 0; i < actions.length; i++){
                    if (_.isEqual(actionId, actions[i].getId())){
                        actionInDB = actions[i];
                        break; // Stop loop
                    }
                }

                // Check if action is found
                if (_.isUndefined(actionInDB)){
                    // Error
                    logger.error('Deleted action failed => Action id "' + actionId +
                    '" not found for this user => Stop');
                    APIResponses.sendResponse(res, responseBody, APICodes.clientErrors.NOT_FOUND, false);
                    return;
                }

                // Action found => ok
                go();
            }, function(err){
                logger.error('Deleted action failed => Cannot get actions for this user (from group ids) => Stop');
                if (configurationService.isVerbose()){
                    // Debug
                    logger.debug(err);
                }
                APIResponses.sendResponse(res, responseBody, APICodes.serverErrors.INTERNAL_ERROR, false);
            });
        }, function(err){
            logger.error('Deleted action failed => Something failed... => Stop');
            if (configurationService.isVerbose()){
                // Debug
                logger.debug(err);
            }
            APIResponses.sendResponse(res, responseBody, APICodes.serverErrors.INTERNAL_ERROR, false);
        });
    });
}

/**
 * Modify Action
 * @param req
 * @param res
 */
function modifyAction(req,res){
    base.apiTokenSecurity(req, res).then(function(user){
        // Success
        var token = user.getToken();
        // Get default response body
        var responseBody = APIResponses.getDefaultResponseBody(token);
        // Get body
        var body = req.body;
        // Log
        logger.info('User "' + user.getName() + '" authenticated');
        // Data
        var newAction = actionModel.Action()
            .setId(body._id)
            .setName(body.name)
            .setCategory(body.category)
            .setScript(body.script)
            .setGroups(body.groups);

        // Set application if defined (not an obligation)
        if (!_.isUndefined(body.application)){
            newAction.setApplication(body.application);
        }

        // Check if data are valid
        if (!newAction.isValid()){
            logger.error('Add action failed => Data not valid (entries) => Stop');
            if (configurationService.isVerbose()){
                logger.debug(newAction.toJson());
            }
            APIResponses.sendResponse(res, responseBody, APICodes.clientErrors.FORBIDDEN, false);
            return;
        }

        base.isUserAdministrator(user).then(function(isAdmin){
            // Check if data are correct (same id in body and params) and data
            if (!_.isEqual(req.params.id, body._id) || !newAction.isValid()){
                // Error
                logger.error('Modification action failed => data not valid => Stop');
                if (configurationService.isVerbose()){
                    // Debug
                    logger.debug(newAction.toJson());
                }
                APIResponses.sendResponse(res, responseBody, APICodes.clientErrors.FORBIDDEN, false);
                return; // Stop here
            }


            databaseService.getGroupsFromIds(newAction.getGroups()).then(function(){
                // Groups ok

                // Function to continue with
                function go(){
                    // Function to continue with
                    function go2(){
                        databaseService.getActionFromId(newAction.getId()).then(function(result) {

                            // Update revision
                            newAction.setRevision(result.getRevision());

                            // Put in database
                            databaseService.put(newAction.toJson()).then(function (result) {
                                logger.info('Modification action success');
                                if (configurationService.isVerbose()) {
                                    // Debug
                                    logger.debug(result);
                                }
                                APIResponses.sendResponse(res, responseBody, APICodes.normal.OK, true);
                            }, function (err) {
                                logger.error('Modification action failed => Something failed... => Stop');
                                if (configurationService.isVerbose()) {
                                    // Debug
                                    logger.debug(err);
                                }
                                APIResponses.sendResponse(res, responseBody, APICodes.serverErrors.INTERNAL_ERROR, false);
                            });
                        }, function(err){
                            logger.error('Modification action failed => Something failed... => Stop');
                            if (configurationService.isVerbose()){
                                // Debug
                                logger.debug(err);
                            }
                            APIResponses.sendResponse(res, responseBody, APICodes.serverErrors.INTERNAL_ERROR, false);
                        });
                    }

                    if (isAdmin){
                        // Administrator detected
                        go2();
                        return;
                    }

                    databaseService.getActionsFromGroupIds(user.getGroups()).then(function(actionsResult){
                        var result = _.find(actionsResult, function(action){
                            return (_.isEqual(action.getId(), newAction.getId()));
                        });

                        if (_.isUndefined(result)) {
                            // Error
                            logger.error('Modification action failed => Cannot find action for this user => Stop');
                            if (configurationService.isVerbose()) {
                                // Debug
                                logger.debug(newAction.toJson());
                            }
                            APIResponses.sendResponse(res, responseBody, APICodes.clientErrors.FORBIDDEN, false);
                            return;
                        }
                        // Continue
                        go2();
                    }, function(err){
                        logger.error('Modification action failed => Something failed... => Stop');
                        if (configurationService.isVerbose()){
                            // Debug
                            logger.debug(err);
                        }
                        APIResponses.sendResponse(res, responseBody, APICodes.serverErrors.INTERNAL_ERROR, false);
                    });
                }

                databaseService.getActionFromCategory(newAction.getName(), newAction.getCategory())
                    .then(function(actionInDB){
                        if (!_.isEqual(newAction.getId(), actionInDB.getId())){
                            // Not same action => Failed
                            logger.error('Modification action failed => Same action name detected => Stop');
                            if (configurationService.isVerbose()){
                                // Debug
                                logger.debug(actionInDB.toJson());
                                logger.debug(newAction.toJson());
                            }
                            APIResponses.sendResponse(res, responseBody, APICodes.clientErrors.FORBIDDEN, false);
                            return;
                        }

                        go();
                    }, function(err){
                        // Check if something wrong
                        if (err){
                            logger.error('Modification action failed => Something failed... => Stop');
                            if (configurationService.isVerbose()){
                                // Debug
                                logger.debug(err);
                            }
                            APIResponses.sendResponse(res, responseBody, APICodes.serverErrors.INTERNAL_ERROR, false);
                            return;
                        }

                        go();
                    });
            }, function(){
                // Error
                logger.error('Modification action failed => data not valid (groups not found) => Stop');
                if (configurationService.isVerbose()){
                    // Debug
                    logger.debug(newAction.toJson());
                }
                APIResponses.sendResponse(res, responseBody, APICodes.clientErrors.FORBIDDEN, false);
            });
        }, function(err){
            logger.error('Modification action failed => Something failed... => Stop');
            if (configurationService.isVerbose()){
                // Debug
                logger.debug(err);
            }
            APIResponses.sendResponse(res, responseBody, APICodes.serverErrors.INTERNAL_ERROR, false);
        });
    });
}

