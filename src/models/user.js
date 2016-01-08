/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 04/12/15
 * Licence: See Readme
 */

// Require
var uuid = require('uuid');
var _ = require('lodash');
var design = require('./designs/user.js');

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
     * Set Id
     * @param id
     * @returns {groupModel}
     */
    this.setId = function(id){
        json._id = id;
        return this;
    };
    /**
     * Set a revision
     * @param rev
     * @returns {actionModel}
     */
    this.setRevision = function(rev){
        json._rev = rev;
        return this;
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
     * Set groupIds
     * @param groupIds
     */
    this.setGroups = function(groupIds){
        json.groups = groupIds;
        return this;
    };
    /**
     * To json
     * @returns {*}
     */
    this.toJson = function(){
        return _.cloneDeep(json);
    };
    /**
     * To minimum json
     */
    this.toMinimumJson = function(){
        var result = this.toJson();
        delete result.password;
        delete result.salt;
        return result;
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
        json.groups = _.cloneDeep(data.groups);
        // Return object
        return this;
    };
    /**
     * Check minimum required
     * @returns {boolean}
     */
    this.isMinimumValid = function(){
        // Check id
        if (!_.isString(json._id) || _.isUndefined(json._id)||
            _.isNull(json._id) || _.isEqual(json._id, '')){
            return false;
        }
        // Check name
        if (!_.isString(json.name) || _.isUndefined(json.name)||
            _.isNull(json.name) || _.isEqual(json.name, '')){
            return false;
        }
        // Check groups
        if (!_.isArray(json.groups) || _.isUndefined(json.groups)||
            _.isNull(json.groups)){
            return false;
        }
        // Check that a group is inserted
        if (json.groups.length === 0){
            return false;
        }

        // Check that every keys are strings
        var i;
        var groupId;
        for (i = 0; i < json.groups.length; i++){
            groupId = json.groups[i];
            if (!_.isString(groupId) || _.isUndefined(groupId)||
                _.isNull(groupId) || _.isEqual(groupId, '')){
                return false;
            }
        }

        // Ok
        return true;
    };
    /**
     * Check if full valid user
     * @returns {boolean}
     */
    this.isFullValid = function(){
        // Check minimum valid
        if (!this.isMinimumValid()){
            return false;
        }

        // Check token
        if (!_.isString(json.token) || _.isUndefined(json.token)||
            _.isNull(json.token) || _.isEqual(json.token, '')){
            return false;
        }

        // Check password
        if (!_.isString(json.password) || _.isUndefined(json.password)||
            _.isNull(json.password) || _.isEqual(json.password, '')){
            return false;
        }

        // Check salt
        if (!_.isString(json.salt) || _.isUndefined(json.salt)||
            _.isNull(json.salt) || _.isEqual(json.salt, '')){
            return false;
        }

        return true;
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


