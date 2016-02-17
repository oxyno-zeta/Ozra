/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 15/02/16
 * Licence: See Readme
 */
(function () {
    'use strict';

    angular
        .module('ozra.parameters.password')
        .config(routeConfig);

        /** @ngInject */
        function routeConfig ($stateProvider) {
            $stateProvider
                .state('ozra.parameters.password', {
                    url: '/password',
                    views: {
                        'content@ozra.parameters': {
                            templateUrl: 'ozra/parameters/password/password.html',
                            controller: 'PasswordUserController',
                            controllerAs: 'passwordUserCtrl'
                        }
                    }
                });
        }

})();
