/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 31/01/16
 * Licence: See Readme
 */

(function () {
    'use strict';

    angular
        .module('ozra.technical.services')
        .service('groupDaoService', groupDaoService);

    /** @ngInject */
    function groupDaoService($q, requestService, groupModelFactory) {
        /* jshint validthis: true */
        var self = this;

        // Private
        var baseUrl = '/api/groups/';
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

        ////////////////

        /**
         * Update group
         * @param group
         * @returns {*}
         */
        function updateGroup(group){
            var deferred = $q.defer();
            var url = baseUrl + group.id;
            requestService.put(url, group).then(function(response){
                var group = groupModelFactory.getFromData(response.plain().group);
                deferred.resolve(group);
            }, deferred.reject);
            return deferred.promise;
        }

        /**
         * Delete a group
         * @param group
         * @returns {*}
         */
        function deleteGroup(group){
            var deferred = $q.defer();
            var url = baseUrl + group.id;
            requestService.remove(url).then(function(response){
                deferred.resolve(response.plain());
            }, deferred.reject);
            return deferred.promise;
        }

        /**
         * Add new group
         * @param newGroup
         * @returns {*}
         */
        function addNewGroup(newGroup){
            var deferred = $q.defer();
            requestService.post(baseUrl, newGroup).then(function(response){
                var group = groupModelFactory.getFromData(response.plain().group);
                deferred.resolve(group);
            }, deferred.reject);
            return deferred.promise;
        }

        /**
         * Create empty group
         * @returns {*}
         */
        function createEmptyNew(){
            return groupModelFactory.createEmptyNew();
        }

        /**
         * Get specific group by id
         * @param id {String} group id
         * @returns {*}
         */
        function getSpecificById(id){
            var deferred = $q.defer();
            var url = baseUrl + id;
            requestService.get(url).then(function(response){
                var group = groupModelFactory.getFromData(response.plain().group);
                deferred.resolve(group);
            }, deferred.reject);
            return deferred.promise;
        }

        /**
         * Get all groups (only for admin)
         * @returns {*}
         */
        function getAll(){
            var deferred = $q.defer();
            requestService.get(baseUrl).then(function(response){
                var groups = [];
                _.forEach(response.plain().groups, function(data){
                    groups.push(groupModelFactory.getFromData(data));
                });
                deferred.resolve(groups);
            }, deferred.reject);
            return deferred.promise;
        }

        /**
         * Get all groups for the current user
         * @returns {*} All groups in a promise
         */
        function getCurrentUserGroups(){
            var deferred = $q.defer();
            var url = baseUrl + 'user/';

            // Create promise
            requestService.get(url).then(function(response){
                var groups = {};
                var group;
                _.forEach(response.groups, function (_group) {
                    group = groupModelFactory.getFromData(_group);
                    groups[group.id] = group;
                });

                deferred.resolve(groups);
            }, deferred.reject);

            return deferred.promise;
        }
    }

})();
