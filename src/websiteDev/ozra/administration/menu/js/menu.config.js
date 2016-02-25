/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 13/02/16
 * Licence: See Readme
 */
(function () {
    'use strict';

    angular
        .module('ozra.administration.menu')
        .config(routeConfig);

        /* @ngInject */
        function routeConfig ($stateProvider) {
            $stateProvider
                .state('ozra.administration', {
                    url: '/administration',
                    abstract: true,
                    views: {
                        content: {
                            templateUrl: 'ozra/administration/menu/menu.html',
                            controller: 'AdministrationMenuController',
                            controllerAs: 'administrationMenuCtrl'
                        }
                    }
                });
        }

})();