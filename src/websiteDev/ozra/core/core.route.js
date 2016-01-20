/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 19/01/16
 * Licence: See Readme
 */

(function () {
    'use strict';

    angular
        .module('ozra.core')
        .config(routeConfig);
        
        /** @ngInject */
        function routeConfig ($urlRouterProvider) {
            $urlRouterProvider.otherwise('/');
        }

})();
