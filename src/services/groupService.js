/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 04/04/16
 * Licence: See Readme
 */

/* ************************************* */
/* ********       REQUIRE       ******** */
/* ************************************* */
var _ = require('lodash');
var APIResponses = require('../routes/api/core/APIResponses');
var APICodes = require('../routes/api/core/APICodes');
var configurationService = require('../services/configurationService');
var securityService = require('./securityService');
var logger = require('../shared/logger');
var groupModel = require('../models/group');
var groupDaoService = require('../dao/groupDaoService');

/* ************************************* */
/* ********       EXPORTS       ******** */
/* ************************************* */
module.exports = {
    api: {
        getAll: getAll,
        getFromUser: getFromUser,
        getFromId: getFromId,
        remove: remove,
        add: add,
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
 * Get all groups
 * @returns {Promise}
 */
function getAll(){
    return new Promise(function(resolve, reject){
        groupDaoService.getAllGroups().then(function(groups){
            var groupsArray = [];
            _.forEach(groups, function(group){
                groupsArray.push(group.toAPIJson());
            });

            // Log
            logger.info('Get all groups => ok');

            // Log groups if verbose activated
            if (configurationService.isVerbose()){
                logger.debug(groupsArray);
            }

            // Response
            resolve({
                status: APICodes.normal.OK,
                data: groupsArray
            });
        }, function(err){
            logger.error('Get all groups failed => Something failed... => Stop');
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
 * Get groups from user (token)
 * @param user
 * @returns {Promise}
 */
function getFromUser(user){
    return new Promise(function(resolve, reject){
        groupDaoService.getGroupsFromIds(user.getGroups()).then(function(groups){
            var groupsObject = [];
            _.forEach(groups, function(group){
                groupsObject.push(group.toAPIJson());
            });

            // Log
            logger.info('Normal response');

            // Log groups if verbose activated
            if (configurationService.isVerbose()){
                logger.debug(groupsObject);
            }

            // Response
            resolve({
                status: APICodes.normal.OK,
                data: groupsObject
            });
        }, function(err){
            logger.error('Get all groups failed => Something failed... => Stop');
            if (configurationService.isVerbose()){
                // Debug
                logger.debug(err);
            }

            // Response
            reject({
                status: APICodes.serverErrors.INTERNAL_ERROR
            });
        });
    });
}

/**
 * Get group from id
 * @param user
 * @param id
 * @returns {Promise}
 */
function getFromId(user, id){
    return new Promise(function(resolve, reject){
        // Check if data are valid
        if (!_.isString(id)|| _.isUndefined(id)|| _.isNull(id)){
            // Id not valid
            logger.error('Get group failed => data not valid => Stop');
            if (configurationService.isVerbose()){
                // Debug
                logger.debug(id);
            }

            reject({
                status: APICodes.clientErrors.FORBIDDEN
            });
            return;
        }

        groupDaoService.getGroupFromId(id).then(function (group) {
            // Ok
            logger.info('Get group success');

            if (configurationService.isVerbose()){
                // Debug
                logger.debug(group.toJson());
            }

            // Response
            resolve({
                status: APICodes.normal.OK,
                data: group.toAPIJson()
            });
        }, function(err){
            // Fail
            logger.error('Get group failed => Group not found => Stop');
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
 * Remove a group from id
 * @param user
 * @param id
 * @returns {Promise}
 */
function remove(user, id){
    return new Promise(function(resolve, reject){
        if (!_.isString(id)|| _.isUndefined(id)|| _.isNull(id)){
            // Id not valid
            logger.error('Delete group failed => data not valid => Stop');
            if (configurationService.isVerbose()){
                // Debug
                logger.debug(id);
            }
            reject({
                status: APICodes.clientErrors.FORBIDDEN
            });
            return;
        }

        // Get group
        groupDaoService.getGroupFromId(id).then(function(group){
            securityService.isGroupLastAdministrator(group).then(function(isLastAdminGroup){
                // Check if last administrator group
                if (isLastAdminGroup){
                    logger.error('Delete group failed => Trying to remove last administrator group => Stop');
                    reject({
                        status: APICodes.clientErrors.FORBIDDEN
                    });
                    return;
                }

                // Got it => delete it
                groupDaoService.deleteGroup(group.toJson()).then(function(){
                    // Done
                    logger.info('Delete group : "' + group.getName() + '" done');
                    // Log group if verbose activated
                    if (configurationService.isVerbose()){
                        logger.debug(group.toJson());
                    }
                    resolve({
                        status: APICodes.normal.OK,
                        data: null
                    });
                }, function(err){
                    // Fail
                    logger.error('Delete group failed => Something failed... => Stop');
                    if (configurationService.isVerbose()){
                        // Debug
                        logger.debug(err);
                    }
                    reject({
                        status: APICodes.serverErrors.INTERNAL_ERROR
                    });
                });
            }, function(err){
                // Fail
                logger.error('Delete group failed => Something failed... => Stop');
                if (configurationService.isVerbose()){
                    // Debug
                    logger.debug(err);
                }
                reject({
                    status: APICodes.serverErrors.INTERNAL_ERROR
                });
            });
        }, function(err){
            // Fail
            logger.error('Delete group failed => Group not found => Stop');
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
 * Add group
 * @param user
 * @param groupData
 * @returns {Promise}
 */
function add(user, groupData){
    return new Promise(function(resolve, reject){
        // Get data
        var newGroup = groupModel.Group()
            .setName(groupData.name)
            .setAdministrator(groupData.administrator);

        // Check if data are valid
        if (!newGroup.isMinimumValid()){
            // Error
            logger.error('Add group failed => data not valid => Stop');
            if (configurationService.isVerbose()){
                // Debug
                logger.debug(newGroup.toJson());
            }
            reject({
                status: APICodes.clientErrors.FORBIDDEN
            });
            return;
        }

        // Data valid

        // Check if group name already exist
        groupDaoService.getGroupFromName(newGroup.getName()).then(function(){
            // Fail => exist...
            logger.error('Add group failed => Name already exist => Stop');
            reject({
                status: APICodes.clientErrors.CONFLICT
            });
        }, function(){
            // Ok => not found
            // Add group to database
            groupDaoService.putGroup(newGroup.toJson()).then(function(){
                // Ok => added
                logger.info('Add group "' + newGroup.getName() + '" success');
                // Log new group if verbose activated
                if (configurationService.isVerbose()){
                    logger.debug(newGroup.toJson());
                }
                // Response
                resolve({
                    status: APICodes.normal.CREATED,
                    data: newGroup.toAPIJson()
                });
            }, function(err){
                // Fail
                logger.error('Add group failed => Something failed... => Stop');
                if (configurationService.isVerbose()){
                    // Debug
                    logger.debug(err);
                }
                reject({
                    status: APICodes.serverErrors.INTERNAL_ERROR
                });
            });
        });
    });
}

/**
 * Modify group
 * @param user
 * @param groupData
 * @param groupId
 * @returns {Promise}
 */
function modify(user, groupData, groupId){
    return new Promise(function(resolve, reject){
        // Data
        var groupModification = new groupModel.Group()
            .setId(groupData.id)
            .setName(groupData.name)
            .setAdministrator(groupData.administrator);

        // Check if data are correct (same id in body and params) and data
        if (!_.isEqual(groupId, groupModification.getId()) || !groupModification.isMinimumValid()){
            // Error
            logger.error('Modification group failed => data not valid => Stop');
            if (configurationService.isVerbose()){
                // Debug
                logger.debug(groupModification.toJson());
            }
            reject({
                status: APICodes.clientErrors.FORBIDDEN
            });
            return; // Stop here
        }

        // Check if group exist in database
        groupDaoService.getGroupFromId(groupModification.getId()).then(function(oldGroup){
            // Function to go after checking
            function go(){
                groupModification.setRevision(oldGroup.getRevision());
                // Add group to database
                groupDaoService.putGroup(groupModification.toJson()).then(function(){
                    // Ok => added
                    logger.info('Modification group name : "' + groupModification.getName() + '" success');
                    // Log new group if verbose activated
                    if (configurationService.isVerbose()){
                        logger.debug(groupModification.toJson());
                    }
                    // Response
                    resolve({
                        status: APICodes.normal.OK,
                        data: groupModification.toAPIJson()
                    });
                }, function(err){
                    // Fail
                    logger.error('Modification group failed => Something failed... => Stop');
                    if (configurationService.isVerbose()){
                        // Debug
                        logger.debug(err);
                    }
                    reject({
                        status: APICodes.serverErrors.INTERNAL_ERROR
                    });
                });
            }
            // Check if group new name already exist
            groupDaoService.getGroupFromName(groupModification.getName()).then(function(oldGroupFromName){
                // Check if group is the same
                if (!_.isEqual(oldGroupFromName.getId(), groupModification.getId())){
                    // Fail => exist on another group...
                    logger.error('Modification group failed => Name already exist => Stop');
                    reject({
                        status: APICodes.clientErrors.CONFLICT
                    });
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
            reject({
                status: APICodes.serverErrors.NOT_FOUND
            });
        });
    });
}



