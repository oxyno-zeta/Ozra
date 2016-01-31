/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 31/01/16
 * Licence: See Readme
 */
(function () {
    'use strict';

    angular
        .module('ozra.technical.dao')
        .service('userDaoService', userDaoService);

    /** @ngInject */
    function userDaoService($q, requestService, userModelFactory) {
        /* jshint validthis: true */
        var self = this;

        // Private
        var baseUrl = '/api/users/';
        // Public
        self.getFromId = getFromId;

        ////////////////

        /**
         * Get current user from id
         * @param id
         * @returns {*}
         */
        function getFromId(id) {
            var deferred = $q.defer();
            var url = baseUrl + id;
            requestService.get(url).then(function(response){
                var user = userModelFactory.getFromData(response.user);
                deferred.resolve(user);
            }, deferred.reject);
            return deferred.promise;
        }
    }

})();