/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 05/12/15
 * Licence: See Readme
 */

/* ************************************* */
/* ********       REQUIRE       ******** */
/* ************************************* */
var uuid = require('uuid');
var _ = require('lodash');
var design = require('./designs/action.js');

/* ************************************* */
/* ********       EXPORTS       ******** */
/* ************************************* */
module.exports = {
    Action: actionModel,
    design: design.design,
    type: design.type
};

/* ************************************* */
/* ********  PRIVATE FUNCTIONS  ******** */
/* ************************************* */



/* ************************************* */
/* ********   PUBLIC FUNCTIONS  ******** */
/* ************************************* */

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
    json.application = null; // Init with nothing
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
        json.application = application;
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
     * Set action group ids
     * @param groups
     * @returns {actionModel}
     */
    this.setGroups = function(groups){
        json.groups = groups;
        return this;
    };
    /**
     * Add group id
     * @param groupId
     * @returns {actionModel}
     */
    this.addGroup = function(groupId){
        if (json.groups.indexOf(groupId) === -1){
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
    /**
     * Check if action is valid
     * @returns {boolean}
     */
    this.isValid = function(){
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
        // Check category
        if (!_.isString(json.category) || _.isUndefined(json.category)||
            _.isNull(json.category) || _.isEqual(json.category, '')){
            return false;
        }
        // Check script
        if (!_.isString(json.script) || _.isUndefined(json.script)||
            _.isNull(json.script) || _.isEqual(json.script, '')){
            return false;
        }
        // Check application
        if (!_.isNull(json.application) && (!_.isString(json.application) || _.isUndefined(json.application)||
            _.isEqual(json.application, '')) ){
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

        return true;
    };


    return this;
}





