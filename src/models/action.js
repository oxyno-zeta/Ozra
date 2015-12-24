/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 05/12/15
 * Licence: See Readme
 */

// Require
var uuid = require('uuid');
var _ = require('lodash');
var design = require('./designs/action.js');

/**
 * Action model
 * @constructor
 * @returns {actionModel}
 */
function actionModel(){
    // Base
    var json = {};
    json._id = uuid.v1();
    json._rev = undefined;
    json.type = design.type;
    json.name = undefined;
    json.category = undefined;
    json.script = undefined;
    json.application = ''; // Init with nothing
    json.groups = [];

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
     * @param id
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
     * @param rev
     * @returns {actionModel}
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
     * Get Category
     * @returns {undefined|*}
     */
    this.getCategory = function(){
        return json.category;
    };
    /**
     * Set category
     * @param category {string} category
     * @returns {actionModel}
     */
    this.setCategory = function(category){
        json.category = category;
        return this;
    };
    /**
     * Get script
     * @returns {undefined|*}
     */
    this.getScript = function(){
        return json.script;
    };
    /**
     * Set script
     * @param script {string} script
     * @returns {actionModel}
     */
    this.setScript = function(script){
        json.script = script;
        return this;
    };
    /**
     * Get application
     * @returns {undefined|*}
     */
    this.getApplication = function(){
        return json.application;
    };
    /**
     * Set application
     * @param application {string} application
     * @returns {actionModel}
     */
    this.setApplication = function(application){
        json.script = application;
        return this;
    };
    /**
     * Get group ids
     * @returns {Array}
     */
    this.getGroups = function(){
        return json.groups;
    };
    /**
     * Add group id
     * @param groupId
     * @returns {actionModel}
     */
    this.addGroup = function(groupId){
        if (json.groups.indexOf(groupId) !== -1){
            json.groups.push(groupId);
        }
        return this;
    };
    /**
     * Remove group id
     * @param groupId
     * @returns {actionModel}
     */
    this.removeGroup = function(groupId){
        var index = json.groups.indexOf(groupId);
        if (index !== -1){
            json.groups.splice(index, 1);
        }
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
     * Clone data
     * @param data {object} action
     * @returns {actionModel}
     */
    this.clone = function(data){
        json._id = data._id;
        json._rev = data._rev;
        json.name = data.name;
        json.category = data.category;
        json.script = data.script;
        json.application = data.application;
        json.groups = _.cloneDeep(data.groups);
        // Return object
        return this;
    };


    return this;
}


// Export
module.exports = {
    Action: actionModel,
    design: design.design,
    type: design.type
};





