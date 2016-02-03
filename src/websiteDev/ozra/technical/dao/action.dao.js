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
        self.getAll = getAll;

        ////////////////

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
    }

})();