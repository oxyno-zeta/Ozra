/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 14/02/16
 * Licence: See Readme
 */
(function () {
    'use strict';

    angular
        .module('ozra.parameters.general')
        .config(routeConfig);

        /** @ngInject */
        function routeConfig ($stateProvider) {
            $stateProvider
                .state('ozra.parameters.general', {
                    url: '/general',
                    views: {
                        content: {
                            templateUrl: 'ozra/parameters/general/general.html',
                            controller: 'GeneralUserController',
                            controllerAs: 'generalUserCtrl'
                        }
                    }
                });
        }

})();
