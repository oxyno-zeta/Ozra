/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 18/01/16
 * Licence: See Readme
 */

(function () {
    'use strict';

    angular
        .module('ozra.technical.services')
        .service('dataCacheService', dataCacheService);

    /** @ngInject */
    function dataCacheService($localStorage) {
        /* jshint validthis: true */
        var self = this;

        // Public
        self.token = $localStorage.token;
        self.currentUser = {};
        self.setToken = setToken;
        self.removeToken = removeToken;

        ////////////////

        /**
         * Set token
         * @param _token
         */
        function setToken(_token){
            $localStorage.token = _token;
            self.token = _token;
        }

        /**
         * Remove token
         */
        function removeToken(){
            delete $localStorage.token;
            self.token = $localStorage.token;
        }

    }

})();



