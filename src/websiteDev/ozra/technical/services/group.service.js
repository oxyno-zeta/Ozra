/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 26/01/16
 * Licence: See Readme
 */

(function () {
    'use strict';

    angular
        .module('ozra.technical.services')
        .service('groupService', groupService);

    /** @ngInject */
    function groupService($q, groupDaoService, dataCacheService) {
        /* jshint validthis: true */
        var self = this;

        // Public
        // Admin part
        self.updateGroup = updateGroup;
        self.deleteGroup = deleteGroup;
        self.addNewGroup = addNewGroup;
        self.createEmptyNew = createEmptyNew;
        self.getSpecificById = getSpecificById;
        // Normal part
        self.getAll = getAll;
        self.getCurrentUserGroups = getCurrentUserGroups;
        self.isOneGroupAdministrator = isOneGroupAdministrator;

        ////////////////

        /**
         * Update group
         * @param group
         * @returns {*}
         */
        function updateGroup(group){
            var deferred = $q.defer();
            groupDaoService.updateGroup(group).then(deferred.resolve, deferred.reject);
            return deferred.promise;
        }

        /**
         * Delete group
         * @param group
         * @returns {*}
         */
        function deleteGroup(group){
            var deferred = $q.defer();
            groupDaoService.deleteGroup(group).then(deferred.resolve, deferred.reject);
            return deferred.promise;
        }

        /**
         * Add new group
         * @param newGroup
         * @returns {*}
         */
        function addNewGroup(newGroup){
            var deferred = $q.defer();
            groupDaoService.addNewGroup(newGroup).then(deferred.resolve, deferred.reject);
            return deferred.promise;
        }

        /**
         * Create empty group
         * @returns {*}
         */
        function createEmptyNew(){
            return groupDaoService.createEmptyNew();
        }

        /**
         * Get specific group by id
         * @param id {String} group id
         * @returns {*}
         */
        function getSpecificById(id){
            var deferred = $q.defer();
            groupDaoService.getSpecificById(id).then(deferred.resolve, deferred.reject);
            return deferred.promise;
        }

        /**
         * Get All groups (only for admin)
         * @returns {*}
         */
        function getAll(){
            var deferred = $q.defer();
            groupDaoService.getAll().then(deferred.resolve, deferred.reject);
            return deferred.promise;
        }

        /**
         * Get all groups for the current user
         * @returns {*} All groups in a promise
         */
        function getCurrentUserGroups(){
            var deferred = $q.defer();
            // Create promise
            groupDaoService.getCurrentUserGroups().then(function(groups){
                dataCacheService.currentGroups = groups;
                deferred.resolve(groups);
            }, deferred.reject);
            return deferred.promise;
        }

        /**
         * Check if one group is administrator
         * @param groups {Object} groups
         * @returns {boolean}
         */
        function isOneGroupAdministrator(groups){
            var keys = _.keys(groups);
            var i, key;
            for (i = 0; i < keys.length; i++){
                key = keys[i];
                if (groups[key].administrator){
                    return true;
                }
            }

            return false;
        }
    }

})();
