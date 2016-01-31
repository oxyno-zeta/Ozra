/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 31/01/16
 * Licence: See Readme
 */

(function () {
    'use strict';

    angular
        .module('ozra.technical.services')
        .service('systemDaoService', systemDaoService);

    /** @ngInject */
    function systemDaoService($q, requestService) {
        /* jshint validthis: true */
        var self = this;

        // Public
        self.login = login;

        ////////////////

        /**
         * Login Request
         * @param username {string} username
         * @param password {string} password
         * @returns {*}
         */
        function login(username, password) {
            var deferred = $q.defer();
            var data = {
                username: username,
                password: password
            };
            requestService.post('/api/system/login/', data).then(deferred.resolve, deferred.reject);
            return deferred.promise;
        }

    }

})();
