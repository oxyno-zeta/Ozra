/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 04/12/15
 * Licence: See Readme
 */

// Require
var uuid = require('uuid');
var design = require('./designs/user.js');
var utils = require('../shared/utils.js');

/**
 * User model
 * @constructor
 * @returns {userModel}
 */
function userModel(){
    // Base
    var json = {};
    json._id = uuid.v1();
    json._rev = undefined;
    json.type = design.type;
    json.name = undefined;
    json.password = undefined;
    json.salt = undefined;
    json.token = undefined;
    json.groups = [];

    // functions

    /**
     * Get id
     * @returns {*|json._id}
     */
    this.getId = function(){
        return json._id;
    };
    /**
     * Get Revision
     * @returns {undefined|*|json._rev}
     */
    this.getRevision = function(){
        return json._rev;
    };
    /**
     * Get type
     * @returns {exports.type|*|json.type}
     */
    this.getType = function(){
        return json.type;
    };
    /**
     * Set Name
     * @param name {string} name
     * @returns {userModel}
     */
    this.setName = function(name){
        json.name = name;
        return this;
    };
    /**
     * Get name
     * @returns {undefined|*|json.name}
     */
    this.getName = function(){
        return json.name;
    };
    /**
     * Set Password
     * @param password {string}
     * @returns {userModel}
     */
    this.setPassword = function(password){
        json.password = password;
        return this;
    };
    /**
     * Get Password
     * @returns {undefined|*}
     */
    this.getPassword = function(){
        return json.password;
    };
    /**
     * Set salt
     * @param salt {string}
     * @returns {userModel}
     */
    this.setSalt = function(salt){
        json.salt = salt;
        return this;
    };
    /**
     * Get salt
     * @returns {undefined|*}
     */
    this.getSalt = function(){
        return json.salt;
    };
    /**
     * Set token
     * @param token {string}
     * @returns {userModel}
     */
    this.setToken = function(token){
        json.token = token;
        return this;
    };
    /**
     * Get token
     * @returns {undefined|*}
     */
    this.getToken = function(){
        return json.token;
    };
    /**
     * Get groups
     * @returns {Array}
     */
    this.getGroups = function(){
        return json.groups;
    };
    /**
     * Add group
     * @param gradeId {string}
     * @returns {userModel}
     */
    this.addGroup = function(gradeId){
        if (json.groups.indexOf(gradeId) === -1) {
            json.groups.push(gradeId);
        }
        return this;
    };
    /**
     * Remove group
     * @param gradeId {string}
     * @returns {userModel}
     */
    this.removeGroup = function(gradeId){
        var gradeIndex = json.groups.indexOf(gradeId);
        if (gradeIndex !== -1){
            json.groups.splice(gradeIndex, 1);
        }
        return this;
    };
    /**
     * To json
     * @returns {*}
     */
    this.toJson = function(){
        return utils.clone(json);
    };
    /**
     * Clone data
     * @param data {object} user
     * @returns {userModel}
     */
    this.clone = function(data){
        json._id = data._id;
        json._rev = data._rev;
        json.name = data.name;
        json.password = data.password;
        json.salt = data.salt;
        json.token = data.token;
        json.groups = utils.clone(data.groups);
        // Return object
        return this;
    };

    // return
    return this;
}

// Export
module.exports = {
    User: userModel,
    design: design.design,
    type: design.type
};


