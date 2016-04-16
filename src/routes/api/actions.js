/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 24/12/15
 * Licence: See Readme
 */

/* ************************************* */
/* ********       REQUIRE       ******** */
/* ************************************* */
var APIResponses = require('./core/APIResponses.js');
var logger = require('../../shared/logger.js');
var actionService = require('../../services/actionService');
var securityService = require('../../services/securityService');

/* ************************************* */
/* ********       EXPORTS       ******** */
/* ************************************* */
module.exports = {
    actionsUrls: actionsUrls
};

/* ************************************* */
/* ********  PRIVATE FUNCTIONS  ******** */
/* ************************************* */

/**
 * Get all actions
 * @warning if user is admin, get all actions, if not, get all user actions (function of groups)
 * @param req
 * @param res
 */
function getAllActions(req, res){
    var user = req.user;
    // Get default response body
    var responseBody = APIResponses.getDefaultResponseBody(user.getToken());

    actionService.api.getAll(user).then(function(response){
        // Add data
        responseBody.actions = response.data;
        // Send
        APIResponses.sendResponse(res, responseBody, response.status, true);
    }, function(errorResponse){
        APIResponses.sendResponse(res, responseBody, errorResponse.status, false);
    });
}

/**
 * Get specific action
 * @param req
 * @param res
 */
function getAction(req, res){
    var user = req.user;
    // Get default response body
    var responseBody = APIResponses.getDefaultResponseBody(user.getToken());
    // Action id
    var actionId = req.params.id;

    actionService.api.getFromId(user, actionId).then(function(response){
        // Add data
        responseBody.action = response.data;
        // Send
        APIResponses.sendResponse(res, responseBody, response.status, true);
    }, function(errorResponse){
        APIResponses.sendResponse(res, responseBody, errorResponse.status, false);
    });
}

/**
 * Execute Action
 * @param req
 * @param res
 */
function runAction(req, res){
    var user = req.user;
    // Get default response body
    var responseBody = APIResponses.getDefaultResponseBody(user.getToken());
    // Action id
    var actionId = req.params.id;

    actionService.api.run(user, actionId).then(function(response){
        // Add data
        responseBody.result = response.data;
        // Send
        APIResponses.sendResponse(res, responseBody, response.status, true);
    }, function(errorResponse){
        APIResponses.sendResponse(res, responseBody, errorResponse.status, false);
    });
}

/**
 * Add action
 * @param req
 * @param res
 */
function addAction(req, res){
    var user = req.user;
    // Get default response body
    var responseBody = APIResponses.getDefaultResponseBody(user.getToken());
    // Get body
    var body = req.body;

    actionService.api.add(user, body).then(function(response){
        // Add data
        responseBody.action = response.data;
        // Send
        APIResponses.sendResponse(res, responseBody, response.status, true);
    }, function(errorResponse){
        APIResponses.sendResponse(res, responseBody, errorResponse.status, false);
    });
}

/**
 * Delete Action
 * @param req
 * @param res
 */
function deleteAction(req, res){
    var user = req.user;
    // Get default response body
    var responseBody = APIResponses.getDefaultResponseBody(user.getToken());
    // Action id
    var actionId = req.params.id;

    actionService.api.remove(user, actionId).then(function(response){
        // Send
        APIResponses.sendResponse(res, responseBody, response.status, true);
    }, function(errorResponse){
        APIResponses.sendResponse(res, responseBody, errorResponse.status, false);
    });
}

/**
 * Modify Action
 * @param req
 * @param res
 */
function modifyAction(req,res){
    var user = req.user;
    // Get default response body
    var responseBody = APIResponses.getDefaultResponseBody(user.getToken());
    // Get body
    var body = req.body;

    actionService.api.modify(user, body, req.params.id).then(function(response){
        // Add data
        responseBody.action = response.data;
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
 * Users Urls
 * @param mainApp {object} Main Express application
 */
function actionsUrls(mainApp){
    // Api token middleware
    mainApp.use('/actions/', securityService.middleware.ozraTokenMiddleware());

    /////////////////////////////

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

