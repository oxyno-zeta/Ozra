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
    function actionService($q, actionDaoService) {
        /* jshint validthis: true */
        var self = this;

        // Public
        self.getAllActions = getAllActions;

        ////////////////

        /**
         * Get all actions for current user
         * @returns {*}
         */
        function getAllActions(){
            var deferred = $q.defer();
            actionDaoService.getAll().then(deferred.resolve, deferred.reject);
            return deferred.promise;
        }
    }

})();
