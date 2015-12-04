/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 04/12/2015
 * Licence: See Readme
 */
//Require
var bcrypt = require('bcrypt');
var promise = require('promise');
//Constants
var tokenLength = 10;


/**
 * Generate Salt
 * @returns {promise}
 */
function genSalt(){
    return new promise(function(resolve, reject){
        bcrypt.genSalt(tokenLength, function(err, salt){
            if (err !== undefined){
                // Error case
                reject(err);
                return;
            }
            // Resolve
            resolve(salt);
        });
    });
}

/**
 * Generate Salt synchronously
 * @returns {*}
 */
function genSaltSync(){
    return bcrypt.genSaltSync(tokenLength);
}

/**
 * Generate hash
 * @param data {string} entry data
 * @param salt {string} salt
 * @returns {promise}
 */
function genHash(data, salt){
    return new promise(function(resolve, reject){
        bcrypt.hash(data, salt, function(err, hash){
            if (err !== undefined){
                // Error
                reject(err);
                return;
            }
            // Resolve
            resolve(hash);
        });
    });
}

/**
 * Generate hash
 * @param data {string} entry data
 * @param salt {string} salt
 * @returns {*}
 */
function genHashSync(data, salt){
    return bcrypt.hashSync(data, salt);
}

/**
 * Generate token
 * @returns {promise}
 */
function genToken(){
    return genSalt();
}

/**
 * Generate token
 * @returns {*}
 */
function genTokenSync(){
    return genSaltSync();
}

/**
 * Compare data and hash
 * @param data {string} data entry
 * @param hash {string} hash
 * @returns {promise}
 */
function compare(data, hash){
    return new promise(function(resolve, reject){
        bcrypt.compare(data, hash, function(err, result){
            if (err !== undefined){
                // Error
                reject(err);
                return;
            }
            // Ok
            resolve(result);
        });
    });
}

/**
 * Compare data and hash
 * @param data {string} data entry
 * @param hash {string} hash
 * @returns {*}
 */
function compareSync(data, hash){
    return bcrypt.compareSync(data, hash);
}

// Exports
module.exports = {
    genSalt: genSalt,
    genSaltSync: genSaltSync,
    genToken: genToken,
    genTokenSync: genTokenSync,
    genHash: genHash,
    genHashSync: genHashSync,
    compare: compare,
    compareSync: compareSync
};


