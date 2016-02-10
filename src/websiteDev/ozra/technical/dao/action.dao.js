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

        ////////////////

        function runFromId(actionId){
            var deferred = $q.defer();
            var url = baseUrl + actionId + '/run';
            requestService.get(url).then(function(result){
                deferred.resolve(result.plain());
            }, function(error){
                deferred.reject(error.plain());
            });
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
    }

})();