/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 08/12/15
 * Licence: See Readme
 */

/* ************************************* */
/* ********       REQUIRE       ******** */
/* ************************************* */
var APIResponses = require('./core/APIResponses.js');
var base = require('./base.js');
var groupService = require('../../services/groupService.js');
var logger = require('../../shared/logger.js');

/* ************************************* */
/* ********       EXPORTS       ******** */
/* ************************************* */
module.exports = {
    groupsUrls: groupsUrls
};

/* ************************************* */
/* ********  PRIVATE FUNCTIONS  ******** */
/* ************************************* */

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

        groupService.api.getAll(user).then(function(response){
            // Add data
            responseBody.groups = response.data;
            // Send
            APIResponses.sendResponse(res, responseBody, response.status, true);
        }, function(errorResponse){
            APIResponses.sendResponse(res, responseBody, errorResponse.status, false);
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

        groupService.api.getFromUser(user).then(function(response){
            // Add data
            responseBody.groups = response.data;
            // Send
            APIResponses.sendResponse(res, responseBody, response.status, true);
        }, function(errorResponse){
            APIResponses.sendResponse(res, responseBody, errorResponse.status, false);
        });
    });
}

/**
 * Get group from id
 * @param req
 * @param res
 */
function getSpecificGroup(req, res){
    base.apiTokenSecurity(req, res).then(function(user){
        // Success
        var token = user.getToken();
        // Get default response body
        var responseBody = APIResponses.getDefaultResponseBody(token);
        // Get group id
        var groupId = req.params.id;
        // Log
        logger.info('User "' + user.getName() + '" authenticated');

        groupService.api.getFromId(user, groupId).then(function(response){
            // Add data
            responseBody.group = response.data;
            // Send
            APIResponses.sendResponse(res, responseBody, response.status, true);
        }, function(errorResponse){
            APIResponses.sendResponse(res, responseBody, errorResponse.status, false);
        });
    });
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
        // Get group id
        var groupId = req.params.id;
        // Log
        logger.info('User "' + user.getName() + '" authenticated');

        groupService.api.remove(user, groupId).then(function(response){
            // Send
            APIResponses.sendResponse(res, responseBody, response.status, true);
        }, function(errorResponse){
            APIResponses.sendResponse(res, responseBody, errorResponse.status, false);
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
        // Log
        logger.info('User "' + user.getName() + '" authenticated');

        groupService.api.add(user, body).then(function(response){
            // Add data
            responseBody.group = response.data;
            // Send
            APIResponses.sendResponse(res, responseBody, response.status, true);
        }, function(errorResponse){
            APIResponses.sendResponse(res, responseBody, errorResponse.status, false);
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
        // Get group id
        var groupId = req.params.id;
        // Get default body
        var responseBody = APIResponses.getDefaultResponseBody(token);
        // Log
        logger.info('User "' + user.getName() + '" authenticated');

        groupService.api.modify(user, body, groupId).then(function(response){
            // Add data
            responseBody.group = response.data;
            // Send
            APIResponses.sendResponse(res, responseBody, response.status, true);
        }, function(errorResponse){
            APIResponses.sendResponse(res, responseBody, errorResponse.status, false);
        });
    });
}

/* ************************************* */
/* ********   PUBLIC FUNCTIONS  ******** */
/* ************************************* */

/**
 * Groups Urls
 * @param mainApp {object} Main Express application
 */
function groupsUrls(mainApp){
    // Get all groups
    mainApp.get('/groups/', getAllGroups);
    // Get all groups for the token user
    mainApp.get('/groups/user/', getGroupsFromUser);
    // Get group from id
    mainApp.get('/groups/:id', getSpecificGroup);
    // Add group
    mainApp.post('/groups/', addGroup);
    // Delete group
    mainApp.delete('/groups/:id', deleteGroup);
    // Modify a group
    mainApp.put('/groups/:id', modifyGroup);
}



