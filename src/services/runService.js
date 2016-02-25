/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 03/01/16
 * Licence: See Readme
 */

// Require
var _ = require('lodash');
var promise = require('promise');
var child = require('child_process');
var osService = require('../services/osService.js');

// Exports
module.exports = {
    exec: exec
};

/**
 * Execute a command on the system
 * @param command
 * @returns {promise}
 */
function exec(command){
    return new promise(function(resolve, reject){
        var ret = {
            code: -1,
            stderr: null,
            stdout: null,
            error: null
        };

        // Script on one line
        if (_.startsWith(command, '#!') && (command.indexOf('\n') === -1)){
            ret.code = 1;
            ret.stderr = 'Script on one line';
            ret.error = new Error();
            reject(ret);
            return;
        }

        var options = {
            timeout: 60 * 1000,
            killSignal: 'SIGKILL',
            encoding: 'utf8'
        };

        child.exec(command, options, function(error, stdout, stderr){
            if (!_.isNull(error)){
                // Error
                ret.code = error.code;
                ret.stderr = stderr;
                ret.error = error;
                reject(ret);
            }
            else {
                ret.code = 0;
                ret.stdout = stdout;
                resolve(ret);
            }
        });
    });
}



