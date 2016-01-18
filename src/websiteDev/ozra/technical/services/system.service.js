/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 18/01/16
 * Licence: See Readme
 */

(function () {
    'use strict';

    angular
        .module('ozra.technical.services')
        .factory('systemService', systemService);

    /** @ngInject */
    function systemService($q, requestService, dataCacheService) {
        var service = {
            login: login,
            logout: logout
        };
        return service;

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
                dataCacheService.setToken(result.token);
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


