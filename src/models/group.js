/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 04/12/15
 * Licence: See Readme
 */

// Require
var uuid = require('uuid');
var _ = require('lodash');
var design = require('./designs/group.js');

/**
 * Group Model
 * @constructor
 * @returns {groupModel}
 */
function groupModel(){
    /* jshint:validatethis */
    var that = this;

    // Base
    var json = {};
    json._id = uuid.v1();
    json._rev = undefined;
    json.type = design.type;
    json.name = undefined;
    json.administrator = false;

    // Functions
    /**
     * Get id
     * @returns {*|json._id}
     */
    this.getId = function(){
        return json._id;
    };
    /**
     * Set Id
     * @param id {string} id
     * @returns {groupModel}
     */
    this.setId = function(id){
        json._id = id;
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
     * Set a revision
     * @param rev {string} revision
     * @returns {groupModel}
     */
    this.setRevision = function(rev){
        json._rev = rev;
        return this;
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
     * Is group administrator
     * @returns {boolean|*}
     */
    this.isAdministrator = function(){
        return json.administrator;
    };
    /**
     * Set administrator level
     * @param admin
     * @returns {groupModel}
     */
    this.setAdministrator = function(admin){
        json.administrator = admin;
        return this;
    };
    /**
     * Clone data
     * @param data {object} group
     * @returns {groupModel}
     */
    this.clone = function(data){
        json._id = data._id;
        json._rev = data._rev;
        json.name = data.name;
        json.administrator = data.administrator;
        return this;
    };
    /**
     * Transform to json
     * @returns {*}
     */
    this.toJson = function(){
        return _.cloneDeep(json);
    };

    /**
     * To API Json
     * @returns {*}
     */
    this.toAPIJson = function(){
        var result = _.cloneDeep(json);
        // Put data in right place
        result.id = result._id;
        // Delete data
        delete result._id;
        delete result._rev;
        return result;
    };

    /**
     * Is minimum valid function
     * @returns {boolean}
     */
    this.isMinimumValid = function(){
        // Check id
        if (!_.isString(json._id) || _.isUndefined(json._id)||
            _.isNull(json._id)|| _.isEqual(json._id, '')){
            return false;
        }
        // Check name
        if (!_.isString(json.name) || _.isUndefined(json.name)||
            _.isNull(json.name)|| _.isEqual(json.name, '')){
            return false;
        }
        // Check administrator
        if (!_.isBoolean(json.administrator) || _.isUndefined(json.administrator)||
            _.isNull(json.administrator)){
            return false;
        }

        // Ok
        return true;
    };

    return this;
}


// Export
module.exports = {
    Group: groupModel,
    design: design.design,
    type: design.type
};
