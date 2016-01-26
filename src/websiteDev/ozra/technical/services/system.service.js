/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 18/01/16
 * Licence: See Readme
 */

(function () {
    'use strict';

    angular
        .module('ozra.technical.services')
        .service('systemService', systemService);

    /** @ngInject */
    function systemService($q, requestService, dataCacheService) {
        /* jshint validthis: true */
        var self = this;

        // Public
        self.login = login;
        self.logout = logout;

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
            requestService.post('/api/system/login/', data).then(function(result){
                // Store data
                dataCacheService.setToken(result.token);
                dataCacheService.setUserId(result.userId);
                // Put default params
                requestService.setDefaultParams();
                // Resolve
                deferred.resolve(result);
            }, deferred.reject);
            return deferred.promise;
        }

        /**
         * Logout Action
         * @returns {*}
         */
        function logout(){
            var deferred = $q.defer();
            dataCacheService.removeToken();
            deferred.resolve();
            return deferred.promise;
        }

    }

})();


