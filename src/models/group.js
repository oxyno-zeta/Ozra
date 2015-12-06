/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 04/12/15
 * Licence: See Readme
 */

// Require
var uuid = require('uuid');
var design = require('./designs/group.js');
var utils = require('../shared/utils.js');

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
        return utils.clone(json);
    };

    return this;
}


// Export
module.exports = {
    Group: groupModel,
    design: design.design,
    type: design.type
};
