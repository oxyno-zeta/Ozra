/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 31/03/16
 * Licence: See Readme
 */

/* ************************************* */
/* ********       REQUIRE       ******** */
/* ************************************* */
var _ = require('lodash');
var child = require('child_process');

/* ************************************* */
/* ********       EXPORTS       ******** */
/* ************************************* */
module.exports = {
    exec: exec
};

/* ************************************* */
/* ********  PRIVATE FUNCTIONS  ******** */
/* ************************************* */



/* ************************************* */
/* ********   PUBLIC FUNCTIONS  ******** */
/* ************************************* */

/**
 * Execute a command with options
 * @param command
 * @param options
 * @returns {*|exports|module.exports}
 */
function exec(command, options){
    return new Promise(function(resolve, reject){
        // Execute command
        child.exec(command, options, function(error, stdout, stderr){
            // Result template
            var result = {
                stderr: stderr,
                stdout: stdout,
                error: error
            };

            if (_.isNull(error)){
                // Ok, no error
                resolve(result);
            }
            else {
                reject(result);
            }
        });
    });
}

