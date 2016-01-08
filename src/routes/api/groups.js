/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 08/12/15
 * Licence: See Readme
 */

// Require
var _ = require('lodash');
var APIResponses = require('./core/APIResponses.js');
var APICodes = require('./core/APICodes.js');
var base = require('./base.js');
var databaseService = require('../../services/databaseService.js');
var configurationService = require('../../shared/configuration.js');
var groupModel = require('../../models/group.js');
var logger = require('../../shared/logger.js');

// Exports
module.exports = {
    groupsUrls: groupsUrls
};

// Functions
/**
 * Groups Urls
 * @param mainApp {object} Main Express application
 */
function groupsUrls(mainApp){
    // Get all groups
    mainApp.get('/groups/', getAllGroups);
    // Get all groups
    mainApp.get('//groups/user/', getGroupsFromUser);
    // Add group
    mainApp.post('/groups/', addGroup);
    // Delete group
    mainApp.delete('/groups/:id', deleteGroup);
    // Modify a group
    mainApp.put('/groups/:id', modifyGroup);
}

/**
 * Delete a group
 * @param req
 * @param res
 */
function deleteGroup(req, res){
    base.apiTokenSecurity(req, res).then(function(user){
        // Success
        var token = user.getToken();
        // Get default response body
        var responseBody = APIResponses.getDefaultResponseBody(token);
        // Log
        logger.info('User "' + user.getName() + '" authenticated');

        // Check if data are valid
        var groupId = req.params.id;
        if (!_.isString(groupId)|| _.isUndefined(groupId)|| _.isNull(groupId)){
            // Id not valid
            logger.error('Delete group failed => data not valid => Stop');
            if (configurationService.isVerbose()){
                // Debug
                logger.debug(groupId);
            }
            APIResponses.sendResponse(res, responseBody, APICodes.clientErrors.FORBIDDEN, false);
            return;
        }

        base.isUserAdministrator(user).then(function(isAdmin){
            if (!isAdmin){
                // Not admin
                logger.error('Add group failed => User "' + user.getName() + '" not administrator => Stop');
                APIResponses.sendResponse(res, responseBody, APICodes.clientErrors.FORBIDDEN, false);
                return;
            }

            // Get group
            databaseService.getGroupFromId(groupId).then(function(group){
                base.isGroupLastAdministrator(group).then(function(isLastAdminGroup){
                    // Check if last administrator group
                    if (isLastAdminGroup){
                        logger.error('Delete group failed => Trying to remove last administrator group => Stop');
                        APIResponses.sendResponse(res, responseBody, APICodes.clientErrors.FORBIDDEN, false);
                        return;
                    }

                    // Got it => delete it
                    databaseService.remove(group.toJson()).then(function(){
                        // Done
                        logger.info('Delete group : "' + group.getName() + '" done');
                        // Log group if verbose activated
                        if (configurationService.isVerbose()){
                            logger.debug(group.toJson());
                        }
                        APIResponses.sendResponse(res, responseBody, APICodes.normal.OK, true);
                    }, function(err){
                        // Fail
                        logger.error('Delete group failed => Something failed... => Stop');
                        if (configurationService.isVerbose()){
                            // Debug
                            logger.debug(err);
                        }
                        APIResponses.sendResponse(res, responseBody, APICodes.serverErrors.INTERNAL_ERROR, false);
                    });
                }, function(err){
                    // Fail
                    logger.error('Delete group failed => Something failed... => Stop');
                    if (configurationService.isVerbose()){
                        // Debug
                        logger.debug(err);
                    }
                    APIResponses.sendResponse(res, responseBody, APICodes.serverErrors.INTERNAL_ERROR, false);
                });
            }, function(err){
                // Fail
                logger.error('Delete group failed => Group not found => Stop');
                if (configurationService.isVerbose()){
                    // Debug
                    logger.debug(err);
                }
                APIResponses.sendResponse(res, responseBody, APICodes.clientErrors.NOT_FOUND, false);
            });
        }, function(err){
            logger.error('Delete group failed => Something failed... => Stop');
            if (configurationService.isVerbose()){
                // Debug
                logger.debug(err);
            }
            APIResponses.sendResponse(res, responseBody, APICodes.serverErrors.INTERNAL_ERROR, false);
        });
    });
}

/**
 * Add a group
 * @param req
 * @param res
 */
function addGroup(req, res){
    base.apiTokenSecurity(req, res).then(function(user){
        // Success
        var token = user.getToken();
        // Get body
        var body = req.body;
        // Get default response body
        var responseBody = APIResponses.getDefaultResponseBody(token);
        // Get data
        var newGroup = groupModel.Group()
            .setName(body.name)
            .setAdministrator(body.administrator);
        // Log
        logger.info('User "' + user.getName() + '" authenticated');

        // Check if data are valid
        if (!newGroup.isMinimumValid()){
            // Error
            logger.error('Add group failed => data not valid => Stop');
            if (configurationService.isVerbose()){
                // Debug
                logger.debug(newGroup.toJson());
            }
            APIResponses.sendResponse(res, responseBody, APICodes.clientErrors.FORBIDDEN, false);
            return;
        }

        // Data valid

        // Check if user if administrator
        base.isUserAdministrator(user).then(function(isAdmin){
            if (!isAdmin){
                // Not admin
                logger.error('Add group failed => User "' + user.getName() + '" not administrator => Stop');
                APIResponses.sendResponse(res, responseBody, APICodes.clientErrors.FORBIDDEN, false);
                return;
            }

            // Check if group name already exist
            databaseService.getGroupFromName(newGroup.getName()).then(function(){
                // Fail => exist...
                logger.error('Add group failed => Name already exist => Stop');
                APIResponses.sendResponse(res, responseBody, APICodes.clientErrors.CONFLICT, false);
            }, function(){
                // Ok => not found
                // Add group to database
                databaseService.put(newGroup.toJson()).then(function(){
                    // Ok => added
                    logger.info('Add group "' + newGroup.getName() + '" success');
                    // Log new group if verbose activated
                    if (configurationService.isVerbose()){
                        logger.debug(newGroup.toJson());
                    }
                    // Add information to response body
                    responseBody.group = newGroup.toJson();
                    // Response
                    APIResponses.sendResponse(res, responseBody, APICodes.normal.CREATED, true);
                }, function(err){
                    // Fail
                    logger.error('Add group failed => Something failed... => Stop');
                    if (configurationService.isVerbose()){
                        // Debug
                        logger.debug(err);
                    }
                    APIResponses.sendResponse(res, responseBody, APICodes.serverErrors.INTERNAL_ERROR, false);
                });
            });
        }, function(err){
            logger.error('Add group failed => Something failed... => Stop');
            if (configurationService.isVerbose()){
                // Debug
                logger.debug(err);
            }
            APIResponses.sendResponse(res, responseBody, APICodes.serverErrors.INTERNAL_ERROR, false);
        });
    });
}

/**
 * Get groups from user
 * @method GET
 * @param req {object} Express request
 * @param res {object} Express response
 */
function getGroupsFromUser(req, res){
    base.apiTokenSecurity(req, res).then(function(user){
        // Success
        var token = user.getToken();
        // Get default body
        var responseBody = APIResponses.getDefaultResponseBody(token);
        // Log
        logger.info('User "' + user.getName() + '" authenticated');

        databaseService.getGroupsFromIds(user.getGroups()).then(function(groups){
            var groupsObject = [];
            _.forEach(groups, function(group){
                groupsObject.push(group.toJson());
            });
            // Add Groups
            responseBody.groups = groupsObject;

            // Log
            logger.info('Normal response');

            // Log groups if verbose activated
            if (configurationService.isVerbose()){
                logger.debug(groupsObject);
            }

            // Response
            APIResponses.sendResponse(res, responseBody, APICodes.normal.OK, true);
        }, function(err){
            logger.error('Get all groups failed => Something failed... => Stop');
            if (configurationService.isVerbose()){
                // Debug
                logger.debug(err);
            }
            APIResponses.sendResponse(res, responseBody, APICodes.serverErrors.INTERNAL_ERROR, false);
        });
    });
}

/**
 * Get all groups
 * @param req
 * @param res
 */
function getAllGroups(req, res){
    base.apiTokenSecurity(req, res).then(function(user){
        // Success
        var token = user.getToken();
        // Get default body
        var responseBody = APIResponses.getDefaultResponseBody(token);
        // Log
        logger.info('User "' + user.getName() + '" authenticated');

        base.isUserAdministrator(user).then(function(isAdmin){
            if (!isAdmin){
                logger.error('Get all groups failed => Not an administrator => Stop');
                APIResponses.sendResponse(res, responseBody, APICodes.clientErrors.FORBIDDEN, false);
                return;
            }

            databaseService.getAllGroups().then(function(groups){
                var groupsArray = [];
                _.forEach(groups, function(group){
                    groupsArray.push(group.toJson());
                });
                // Add Groups
                responseBody.groups = groupsArray;

                // Log
                logger.info('Get all groups => ok');

                // Log groups if verbose activated
                if (configurationService.isVerbose()){
                    logger.debug(groupsArray);
                }

                // Response
                APIResponses.sendResponse(res, responseBody, APICodes.normal.OK, true);
            }, function(err){
                logger.error('Get all groups failed => Something failed... => Stop');
                if (configurationService.isVerbose()){
                    // Debug
                    logger.debug(err);
                }
                APIResponses.sendResponse(res, responseBody, APICodes.serverErrors.INTERNAL_ERROR, false);
            });
        }, function(err){
            logger.error('Get all groups failed => Something failed... => Stop');
            if (configurationService.isVerbose()){
                // Debug
                logger.debug(err);
            }
            APIResponses.sendResponse(res, responseBody, APICodes.serverErrors.INTERNAL_ERROR, false);
        });
    });
}

/**
 * Modify a group
 * @param req
 * @param res
 */
function modifyGroup(req, res){
    base.apiTokenSecurity(req, res).then(function(user){
        // Success
        var token = user.getToken();
        // Get body
        var body = req.body;
        // Get default body
        var responseBody = APIResponses.getDefaultResponseBody(token);
        // Data
        var groupModification = new groupModel.Group()
            .setId(body._id)
            .setName(body.name)
            .setAdministrator(body.administrator);
        // Log
        logger.info('User "' + user.getName() + '" authenticated');

        // Check if user is administrator
        base.isUserAdministrator(user).then(function(isAdmin){
            if (!isAdmin){
                // Not admin
                logger.error('Modification group failed => User "' + user.getName() + '" not administrator => Stop');
                APIResponses.sendResponse(res, responseBody, APICodes.clientErrors.FORBIDDEN, false);
                return;
            }

            // Check if data are correct (same id in body and params) and data
            if (!_.isEqual(req.params.id, body._id) || !groupModification.isMinimumValid()){
                // Error
                logger.error('Modification group failed => data not valid => Stop');
                if (configurationService.isVerbose()){
                    // Debug
                    logger.debug(groupModification.toJson());
                }
                APIResponses.sendResponse(res, responseBody, APICodes.clientErrors.FORBIDDEN, false);
                return; // Stop here
            }

            // Check if group exist in database
            databaseService.getGroupFromId(groupModification.getId()).then(function(oldGroup){
                // Function to go after checking
                function go(){
                    groupModification.setRevision(oldGroup.getRevision());
                    // Add group to database
                    databaseService.put(groupModification.toJson()).then(function(){
                        // Ok => added
                        logger.info('Modification group name : "' + groupModification.getName() + '" success');
                        // Log new group if verbose activated
                        if (configurationService.isVerbose()){
                            logger.debug(groupModification.toJson());
                        }
                        // Add information to response body
                        responseBody.group = groupModification.toJson();
                        // Response
                        APIResponses.sendResponse(res, responseBody, APICodes.normal.OK, true);
                    }, function(err){
                        // Fail
                        logger.error('Modification group failed => Something failed... => Stop');
                        if (configurationService.isVerbose()){
                            // Debug
                            logger.debug(err);
                        }
                        APIResponses.sendResponse(res, responseBody, APICodes.serverErrors.INTERNAL_ERROR, false);
                    });
                }
                // Check if group new name already exist
                databaseService.getGroupFromName(groupModification.getName()).then(function(oldGroupFromName){
                    // Check if group is the same
                    if (!_.isEqual(oldGroupFromName.getId(), groupModification.getId())){
                        // Fail => exist on another group...
                        logger.error('Modification group failed => Name already exist => Stop');
                        APIResponses.sendResponse(res, responseBody, APICodes.clientErrors.CONFLICT, false);
                        return;
                    }
                    // Same group detected
                    // Data ok
                    go();
                }, function(){
                    // Ok => not found
                    // Data ok
                    go();
                });
            }, function(err){
                // Fail
                logger.error('Modification group failed => Group not exist => Stop');
                if (configurationService.isVerbose()){
                    // Debug
                    logger.debug(err);
                }
                APIResponses.sendResponse(res, responseBody, APICodes.serverErrors.NOT_FOUND, false);
            });
        }, function(err){
            logger.error('Modification group failed => Something failed... => Stop');
            if (configurationService.isVerbose()){
                // Debug
                logger.debug(err);
            }
            APIResponses.sendResponse(res, responseBody, APICodes.serverErrors.INTERNAL_ERROR, false);
        });
    });
}

