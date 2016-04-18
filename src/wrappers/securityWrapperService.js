/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 04/12/2015
 * Licence: See Readme
 */

/* ************************************* */
/* ********       REQUIRE       ******** */
/* ************************************* */
var crypto = require('crypto');
var _ = require('lodash');
//Constants
var defaultRandomLength = 30;
var defaultIterations = 10000;
var defaultKeyLength = 64;

/* ************************************* */
/* ********       EXPORTS       ******** */
/* ************************************* */
module.exports = {
    genSalt: genSalt,
    genToken: genToken,
    genHash: genHash,
    compare: compare
};

/* ************************************* */
/* ********  PRIVATE FUNCTIONS  ******** */
/* ************************************* */

/**
 * Generate Random
 * @returns {Promise}
 */
function generateRandom() {
    return new Promise(function(resolve, reject){
        crypto.randomBytes(defaultRandomLength, function(err, random){
            if (err) {
                reject(err);
            } else {
                resolve(random.toString('base64'));
            }
        });
    });
}

/**
 * Encrypt password
 *
 * @param {String} password
 * @param {String} salt
 * @return {String}
 */
function encryptPassword(password, salt) {
    return new Promise(function(resolve, reject){
        var saltBuffer = new Buffer(salt, 'base64');

        crypto.pbkdf2(password, saltBuffer, defaultIterations, defaultKeyLength, function(err, key) {
            if (err) {
                reject(err);
            } else {
                resolve(key.toString('base64'));
            }
        });
    });
}

/* ************************************* */
/* ********   PUBLIC FUNCTIONS  ******** */
/* ************************************* */

/**
 * Generate Salt
 * @returns {Promise}
 */
function genSalt(){
    return generateRandom();
}

/**
 * Generate token
 * @returns {Promise}
 */
function genToken(){
    return genSalt();
}

/**
 * Generate hash
 * @param data {String} entry data
 * @param salt {String} salt
 * @returns {Promise}
 */
function genHash(data, salt){
    return encryptPassword(data, salt);
}

/**
 * Compare data and hash
 * @param password {String} password
 * @param salt {String} salt
 * @param hash {String} hash
 * @returns {Promise}
 */
function compare(password, salt, hash){
    return new Promise(function(resolve, reject){
        encryptPassword(password, salt).then(function(encrypt){
            if (_.isEqual(encrypt, hash)){
                resolve();
            }
            else {
                reject();
            }
        }, reject);
    });
}


