/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 09/01/16
 * Licence: See Readme
 */

/* ************************************* */
/* ********       REQUIRE       ******** */
/* ************************************* */
var _ = require('lodash');
var APIResponses = require('./core/APIResponses');
var systemService = require('../../services/systemService');

/* ************************************* */
/* ********       EXPORTS       ******** */
/* ************************************* */
module.exports = {
    systemsUrls: systemsUrls
};


/* ************************************* */
/* ********  PRIVATE FUNCTIONS  ******** */
/* ************************************* */

/**
 * Login api
 * @param req
 * @param res
 */
function login(req, res){
    // Get body
    var body = req.body;
    // Set default error
    var responseBody = APIResponses.getDefaultResponseBody();

    systemService.api.login(body).then(function(response){
        // Add data
        responseBody.token = response.data.token;
        responseBody.userId = response.data.userId;
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
 * API System
 * @param mainApp
 */
function systemsUrls(mainApp){
    // Put login api
    mainApp.post('/system/login/', login);
}

