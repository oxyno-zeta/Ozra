/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 31/01/16
 * Licence: See Readme
 */
(function () {
    'use strict';

    angular
        .module('ozra.technical.dao')
        .service('actionDaoService', actionDaoService);

    /** @ngInject */
    function actionDaoService($q, requestService, actionModelFactory) {
        /* jshint validthis: true */
        var self = this;

        // Private
        var baseUrl = '/api/actions/';
        // Public
        self.runFromId = runFromId;
        self.getAll = getAll;
        self.getFromId = getFromId;
        self.createEmptyNew = createEmptyNew;
        self.addNewAction = addNewAction;
        self.deleteAction = deleteAction;
        self.updateAction = updateAction;

        ////////////////

        /**
         * Update action
         * @param action
         * @returns {*}
         */
        function updateAction(action){
            var deferred = $q.defer();
            var url = baseUrl + action.id;
            requestService.put(url, action).then(function(response){
                deferred.resolve(actionModelFactory.getFromData(response.plain().action));
            }, deferred.reject);
            return deferred.promise;
        }

        /**
         * Delete an action
         * @param actionId
         * @returns {*}
         */
        function deleteAction(actionId){
            var deferred = $q.defer();
            var url = baseUrl + actionId;
            requestService.remove(url).then(function(result){
                deferred.resolve(result.plain());
            }, deferred.reject);
            return deferred.promise;
        }

        /**
         * Add new action
         * @param newAction
         * @returns {*}
         */
        function addNewAction(newAction){
            var deferred = $q.defer();
            requestService.post(baseUrl, newAction).then(function(response){
                deferred.resolve(actionModelFactory.getFromData(response.plain().action));
            }, deferred.reject);
            return deferred.promise;
        }

        /**
         * Run action from id
         * @param actionId
         * @returns {*}
         */
        function runFromId(actionId){
            var deferred = $q.defer();
            var url = baseUrl + actionId + '/run';
            requestService.get(url).then(function(result){
                deferred.resolve(result.plain());
            }, deferred.reject);
            return deferred.promise;
        }

        /**
         * Get all actions for current user
         * @returns {*}
         */
        function getAll() {
            var deferred = $q.defer();
            requestService.get(baseUrl).then(function(response){
                var actions = [];
                _.forEach(response.plain().actions, function(actionData){
                    actions.push(actionModelFactory.getFromData(actionData));
                });
                deferred.resolve(actions);
            }, deferred.reject);
            return deferred.promise;
        }

        /**
         * Get specific action from id
         * @param id {String} Action id
         * @returns {*}
         */
        function getFromId(id){
            var deferred = $q.defer();
            var url = baseUrl + id;
            requestService.get(url).then(function(response){
                deferred.resolve(actionModelFactory.getFromData(response.plain().action));
            }, deferred.reject);
            return deferred.promise;
        }

        /**
         * Create Empty New action
         * @returns {*}
         */
        function createEmptyNew(){
            return actionModelFactory.createEmptyNew();
        }
    }

})();