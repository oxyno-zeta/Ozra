/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 13/02/16
 * Licence: See Readme
 */
(function () {
    'use strict';

    angular
        .module('ozra.parameters.menu')
        .config(routeConfig);

        /* @ngInject */
        function routeConfig ($stateProvider) {
            $stateProvider
                .state('ozra.parameters', {
                    url: '/parameters',
                    abstract: true,
                    views: {
                        content: {
                            templateUrl: 'ozra/parameters/menu/menu.html',
                            controller: 'ParametersMenuController',
                            controllerAs: 'parametersMenuCtrl'
                        }
                    }
                });
        }

})();