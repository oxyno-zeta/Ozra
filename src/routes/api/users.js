/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 16/12/15
 * Licence: See Readme
 */

/* ************************************* */
/* ********       REQUIRE       ******** */
/* ************************************* */
var APIResponses = require('./core/APIResponses.js');
var APICodes = require('./core/APICodes.js');
var base = require('./base.js');
var userService = require('../../services/userService');
var logger = require('../../shared/logger.js');

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
    base.apiTokenSecurity(req, res).then(function(user){
        // Success
        var token = user.getToken();
        // Get default response body
        var responseBody = APIResponses.getDefaultResponseBody(token);
        // Log
        logger.info('User "' + user.getName() + '" authenticated');

        userService.api.getAll(user).then(function(response){
            // Add data
            responseBody.users = response.data;
            // Send response
            APIResponses.sendResponse(res, responseBody, response.status, true);
        }, function(response){
            // Send response
            APIResponses.sendResponse(res, responseBody, response.status, false);
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

        userService.api.getFromId(user, userId).then(function(response){
            // Add data
            responseBody.user = response.data;
            // Send response
            APIResponses.sendResponse(res, responseBody, response.status, true);
        }, function(response){
            // Send response
            APIResponses.sendResponse(res, responseBody, response.status, false);
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

        userService.api.add(user, body).then(function(response){
            // Add data
            responseBody.user = response.data;
            // Send response
            APIResponses.sendResponse(res, responseBody, response.status, true);
        }, function(response){
            // Send response
            APIResponses.sendResponse(res, responseBody, response.status, false);
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
        // User id
        var userId = req.params.id;
        // Get default response body
        var responseBody = APIResponses.getDefaultResponseBody(token);
        // Log
        logger.info('User "' + user.getName() + '" authenticated');

        userService.api.remove(user, userId).then(function(response){
            // Send response
            APIResponses.sendResponse(res, responseBody, response.status, true);
        }, function(response){
            // Send response
            APIResponses.sendResponse(res, responseBody, response.status, false);
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
        // User id
        var userId = req.params.id;
        // Get default response body
        var responseBody = APIResponses.getDefaultResponseBody(token);
        // Log
        logger.info('User "' + user.getName() + '" authenticated');

        userService.api.modifyUser(user, body, userId).then(function(response){
            // Add data
            responseBody.user = response.data;
            // Send response
            APIResponses.sendResponse(res, responseBody, response.status, true);
        }, function(response){
            // Send response
            APIResponses.sendResponse(res, responseBody, response.status, false);
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
        // User id
        var userId = req.params.id;
        // Get default response body
        var responseBody = APIResponses.getDefaultResponseBody(token);
        // Log
        logger.info('User "' + user.getName() + '" authenticated');

        userService.api.modifyUserPassword(user, body, userId).then(function(response){
            // Add data
            responseBody.user = response.data;
            // Send response
            APIResponses.sendResponse(res, responseBody, response.status, true);
        }, function(response){
            // Send response
            APIResponses.sendResponse(res, responseBody, response.status, false);
        });
    });
}


/* ************************************* */
/* ********   PUBLIC FUNCTIONS  ******** */
/* ************************************* */

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
