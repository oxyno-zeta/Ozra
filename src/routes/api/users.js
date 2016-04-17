/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 16/12/15
 * Licence: See Readme
 */

/* ************************************* */
/* ********       REQUIRE       ******** */
/* ************************************* */
var APIResponses = require('./core/APIResponses');
var APICodes = require('./core/APICodes');
var securityService = require('../../services/securityService');
var userService = require('../../services/userService');
var logger = require('../../shared/logger');

/* ************************************* */
/* ********       EXPORTS       ******** */
/* ************************************* */
module.exports = {
    usersUrls: usersUrls
};

/* ************************************* */
/* ********  PRIVATE FUNCTIONS  ******** */
/* ************************************* */

/**
 * Get all users
 * @param req
 * @param res
 */
function getAllUsers(req, res){
    // Get user
    var user = req.user;
    // Get default response body
    var responseBody = APIResponses.getDefaultResponseBody(user.getToken());

    userService.api.getAll().then(function(response){
        // Add data
        responseBody.users = response.data;
        // Send response
        APIResponses.sendResponse(res, responseBody, response.status, true);
    }, function(response){
        // Send response
        APIResponses.sendResponse(res, responseBody, response.status, false);
    });
}

/**
 * Get specific user from id
 * @param req
 * @param res
 */
function getUser(req, res){
    // Get user
    var user = req.user;
    // Get default response body
    var responseBody = APIResponses.getDefaultResponseBody(user.getToken());
    // User id
    var userId = req.params.id;

    userService.api.getFromId(user, userId).then(function(response){
        // Add data
        responseBody.user = response.data;
        // Send response
        APIResponses.sendResponse(res, responseBody, response.status, true);
    }, function(response){
        // Send response
        APIResponses.sendResponse(res, responseBody, response.status, false);
    });
}

/**
 * Add user
 * @param req
 * @param res
 */
function addUser(req, res){
    var user = req.user;
    // Get default response body
    var responseBody = APIResponses.getDefaultResponseBody(user.getToken());
    // Body
    var body = req.body;

    userService.api.add(user, body).then(function(response){
        // Add data
        responseBody.user = response.data;
        // Send response
        APIResponses.sendResponse(res, responseBody, response.status, true);
    }, function(response){
        // Send response
        APIResponses.sendResponse(res, responseBody, response.status, false);
    });
}

/**
 * Delete user
 * @param req
 * @param res
 */
function deleteUser(req, res){
    var user = req.user;
    // User id
    var userId = req.params.id;
    // Get default response body
    var responseBody = APIResponses.getDefaultResponseBody(user.getToken());

    userService.api.remove(user, userId).then(function(response){
        // Send response
        APIResponses.sendResponse(res, responseBody, response.status, true);
    }, function(response){
        // Send response
        APIResponses.sendResponse(res, responseBody, response.status, false);
    });
}

/**
 * Modify user
 * @warning Only administrators can modify users
 * @param req
 * @param res
 */
function modifyUser(req, res){
    var user = req.user;
    // Get body
    var body = req.body;
    // User id
    var userId = req.params.id;
    // Get default response body
    var responseBody = APIResponses.getDefaultResponseBody(user.getToken());

    userService.api.modifyUser(user, body, userId).then(function(response){
        // Add data
        responseBody.user = response.data;
        // Send response
        APIResponses.sendResponse(res, responseBody, response.status, true);
    }, function(response){
        // Send response
        APIResponses.sendResponse(res, responseBody, response.status, false);
    });
}

/**
 * Modify a user password
 * @param req
 * @param res
 */
function modifyUserPassword(req, res){
    var user = req.user;
    // Get body
    var body = req.body;
    // User id
    var userId = req.params.id;
    // Get default response body
    var responseBody = APIResponses.getDefaultResponseBody(user.getToken());

    userService.api.modifyUserPassword(user, body, userId).then(function(response){
        // Add data
        responseBody.user = response.data;
        // Send response
        APIResponses.sendResponse(res, responseBody, response.status, true);
    }, function(response){
        // Send response
        APIResponses.sendResponse(res, responseBody, response.status, false);
    });
}

/**
 * Get Current user
 * @param req
 * @param res
 */
function getCurrentUser(req, res){
    var user = req.user;
    // Get default response body
    var responseBody = APIResponses.getDefaultResponseBody(user.getToken());

    // Log
    logger.info('Get current user for "' + user.getName() + '" succeed');

    // Add data
    responseBody.user = user.toAPIJson();
    // Send response
    APIResponses.sendResponse(res, responseBody, APICodes.normal.OK, true);
}


/* ************************************* */
/* ********   PUBLIC FUNCTIONS  ******** */
/* ************************************* */

/**
 * Users Urls
 * @param mainApp {object} Main Express application
 */
function usersUrls(mainApp){
    // Api token middleware
    mainApp.use('/users/', securityService.middleware.ozraTokenMiddleware());

    /////////////////////////////

    // Get all users
    mainApp.get('/users/', securityService.middleware.ozraRequireAdminMiddleware(), getAllUsers);
    // Get current user
    mainApp.get('/users/current', getCurrentUser);
    // Get specific user
    mainApp.get('/users/:id', getUser);
    // Add user
    mainApp.post('/users/', securityService.middleware.ozraRequireAdminMiddleware(), addUser);
    // Delete user
    mainApp.delete('/users/:id', securityService.middleware.ozraRequireAdminMiddleware(), deleteUser);
    // Modify a user
    mainApp.put('/users/:id', securityService.middleware.ozraRequireAdminMiddleware(), modifyUser);
    // Modify user password
    mainApp.put('/users/:id/password', modifyUserPassword);
}
