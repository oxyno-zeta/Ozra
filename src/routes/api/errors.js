/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 07/12/15
 * Licence: See Readme
 */

/* ************************************* */
/* ********       REQUIRE       ******** */
/* ************************************* */
var base = require('../routesBase.js');
var APIResponses = require('../api/core/APIResponses.js');
var APICodes = require('../api/core/APICodes.js');

/* ************************************* */
/* ********       EXPORTS       ******** */
/* ************************************* */
module.exports = {
    errorUrls: errorUrls
};

/* ************************************* */
/* ********  PRIVATE FUNCTIONS  ******** */
/* ************************************* */



/* ************************************* */
/* ********   PUBLIC FUNCTIONS  ******** */
/* ************************************* */

/**
 * API errors
 * @param app
 */
function errorUrls(app){

    /* 404 not found if we don't find a route */
    app.use(function(req, res, next){

        // Log Client
        base.logClientError(req);

        // API Fail
        var body = APIResponses.getDefaultResponseBody();
        APIResponses.sendResponse(res, body, APICodes.clientErrors.NOT_FOUND, false);
    });

}


