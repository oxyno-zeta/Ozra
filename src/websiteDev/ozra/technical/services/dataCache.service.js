/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 18/01/16
 * Licence: See Readme
 */

(function () {
    'use strict';

    angular
        .module('ozra.technical.services')
        .factory('dataCacheService', dataCacheService);

    /** @ngInject */
    function dataCacheService($localStorage) {
        // Private
        var token = $localStorage.token;
        var currentUser = {};

        // Public
        var service = {
            token: token,
            currentUser: currentUser,
            setToken: setToken,
            removeToken: removeToken
        };

        return service;

        ////////////////

        /**
         * Set token
         * @param _token
         */
        function setToken(_token){
            $localStorage.token = _token;
            token = _token;
        }

        /**
         * Remove token
         */
        function removeToken(){
            delete $localStorage.token;
            token = $localStorage.token;
        }

    }

})();



