/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 26/01/16
 * Licence: See Readme
 */

(function () {
    'use strict';

    angular
        .module('ozra.technical.services')
        .service('actionService', actionService);

    /** @ngInject */
    function actionService($q, actionDaoService, dataCacheService) {
        /* jshint validthis: true */
        var self = this;

        // Public
        self.runFromId = runFromId;
        self.getAllActions = getAllActions;
        self.getFromId = getFromId;

        ////////////////

        // Public
        function runFromId(actionId){
            return actionDaoService.runFromId(actionId);
        }

        /**
         * Get all actions for current user
         * @returns {*}
         */
        function getAllActions(){
            var deferred = $q.defer();
            actionDaoService.getAll().then(deferred.resolve, deferred.reject);
            return deferred.promise;
        }

        /**
         * Get specific action from id
         * @param id {String} Action id
         * @param needPopulate {Boolean} Need to populate action with groups
         * @returns {*}
         */
        function getFromId(id, needPopulate){
            var deferred = $q.defer();
            actionDaoService.getFromId(id).then(function(action){
                if (needPopulate){
                    deferred.resolve(populateActionWithGroups(action));
                    return;
                }

                deferred.resolve(action);
            }, deferred.reject);
            return deferred.promise;
        }

        // Private
        /**
         * Populate Action with groups (full object)
         * @param action
         * @returns {*}
         */
        function populateActionWithGroups(action){
            var groupIds = action.groups;
            var currentGroupsObject = dataCacheService.currentGroups;
            // Groups array
            var groups = [];
            var group;
            // Populate
            _.forEach(groupIds, function(id){
                group = currentGroupsObject[id];
                if (!_.isUndefined(group)){
                    groups.push(group);
                }
            });
            // Put data in action
            action.groups = groups;
            return action;
        }

    }

})();
