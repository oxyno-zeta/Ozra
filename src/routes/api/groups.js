/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 08/12/15
 * Licence: See Readme
 */

/* ************************************* */
/* ********       REQUIRE       ******** */
/* ************************************* */
var APIResponses = require('./core/APIResponses');
var securityService = require('../../services/securityService');
var groupService = require('../../services/groupService');
var logger = require('../../shared/logger');

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
    var user = req.user;
    // Get default body
    var responseBody = APIResponses.getDefaultResponseBody(user.getToken());

    groupService.api.getAll(user).then(function(response){
        // Add data
        responseBody.groups = response.data;
        // Send
        APIResponses.sendResponse(res, responseBody, response.status, true);
    }, function(errorResponse){
        APIResponses.sendResponse(res, responseBody, errorResponse.status, false);
    });
}

/**
 * Get groups from user
 * @method GET
 * @param req {object} Express request
 * @param res {object} Express response
 */
function getGroupsFromUser(req, res){
    var user = req.user;
    // Get default body
    var responseBody = APIResponses.getDefaultResponseBody(user.getToken());

    groupService.api.getFromUser(user).then(function(response){
        // Add data
        responseBody.groups = response.data;
        // Send
        APIResponses.sendResponse(res, responseBody, response.status, true);
    }, function(errorResponse){
        APIResponses.sendResponse(res, responseBody, errorResponse.status, false);
    });
}

/**
 * Get group from id
 * @param req
 * @param res
 */
function getSpecificGroup(req, res){
    var user = req.user;
    // Get default response body
    var responseBody = APIResponses.getDefaultResponseBody(user.getToken());
    // Get group id
    var groupId = req.params.id;

    groupService.api.getFromId(user, groupId).then(function(response){
        // Add data
        responseBody.group = response.data;
        // Send
        APIResponses.sendResponse(res, responseBody, response.status, true);
    }, function(errorResponse){
        APIResponses.sendResponse(res, responseBody, errorResponse.status, false);
    });
}

/**
 * Delete a group
 * @param req
 * @param res
 */
function deleteGroup(req, res){
    var user = req.user;
    // Get default response body
    var responseBody = APIResponses.getDefaultResponseBody(user.getToken());
    // Get group id
    var groupId = req.params.id;

    groupService.api.remove(user, groupId).then(function(response){
        // Send
        APIResponses.sendResponse(res, responseBody, response.status, true);
    }, function(errorResponse){
        APIResponses.sendResponse(res, responseBody, errorResponse.status, false);
    });
}

/**
 * Add a group
 * @param req
 * @param res
 */
function addGroup(req, res){
    var user = req.user;
    // Get body
    var body = req.body;
    // Get default response body
    var responseBody = APIResponses.getDefaultResponseBody(user.getToken());

    groupService.api.add(user, body).then(function(response){
        // Add data
        responseBody.group = response.data;
        // Send
        APIResponses.sendResponse(res, responseBody, response.status, true);
    }, function(errorResponse){
        APIResponses.sendResponse(res, responseBody, errorResponse.status, false);
    });
}

/**
 * Modify a group
 * @param req
 * @param res
 */
function modifyGroup(req, res){
    var user = req.user;
    // Get body
    var body = req.body;
    // Get group id
    var groupId = req.params.id;
    // Get default body
    var responseBody = APIResponses.getDefaultResponseBody(user.getToken());

    groupService.api.modify(user, body, groupId).then(function(response){
        // Add data
        responseBody.group = response.data;
        // Send
        APIResponses.sendResponse(res, responseBody, response.status, true);
    }, function(errorResponse){
        APIResponses.sendResponse(res, responseBody, errorResponse.status, false);
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
    // Put api token middleware
    mainApp.use('/groups/', securityService.middleware.ozraTokenMiddleware());

    /////////////////////////

    // Get all groups
    mainApp.get('/groups/', securityService.middleware.ozraRequireAdminMiddleware(), getAllGroups);
    // Get all groups for the token user
    mainApp.get('/groups/user/', getGroupsFromUser);
    // Get group from id
    mainApp.get('/groups/:id', securityService.middleware.ozraRequireAdminMiddleware(), getSpecificGroup);
    // Add group
    mainApp.post('/groups/', securityService.middleware.ozraRequireAdminMiddleware(), addGroup);
    // Delete group
    mainApp.delete('/groups/:id', securityService.middleware.ozraRequireAdminMiddleware(), deleteGroup);
    // Modify a group
    mainApp.put('/groups/:id', securityService.middleware.ozraRequireAdminMiddleware(), modifyGroup);
}



