/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 02/02/16
 * Licence: See Readme
 */

(function () {
    'use strict';

    angular
        .module('ozra.actions.properties')
        .config(routeConfig);

        /** @ngInject */
        function routeConfig ($stateProvider) {
            $stateProvider
                .state('ozra.actions.properties', {
                    url: '/:id/edit',
                    views: {
                        'content@ozra': {
                            templateUrl: 'ozra/actions/properties/properties.html',
                            controller: 'ActionsPropertiesController',
                            controllerAs: 'actionsPropertiesCtrl'
                        }
                    },
                    resolve: {
                        action: function($stateParams, actionService){
                            return actionService.getFromId($stateParams.id, true);
                        }
                    }
                });
        }

})();
