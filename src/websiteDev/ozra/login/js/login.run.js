/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 25/01/16
 * Licence: See Readme
 */

(function () {
    'use strict';

    angular
        .module('ozra.login')
        .run(runRouteErrors);

        /** @ngInject */
        function runRouteErrors ($rootScope, $state, dataCacheService) {
            $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error){
                if ( !(_.isUndefined(error) && _.isNull(error)) && _.isEqual(error.status, 403)){
                    event.preventDefault(); // Stop transition
                    // Remove data
                    dataCacheService.removeToken();
                    dataCacheService.removeUserId();
                    // Go to state
                    $state.go('login');
                }
            });

            $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams, error){
                var token = dataCacheService.token;
                if (!_.isEqual(toState.name, 'login') && (_.isUndefined(token) || _.isNull(token)) ){
                    event.preventDefault(); // Stop transition
                    $state.go('login');
                    return;
                }

                if (_.isEqual(toState.name, 'login') && !(_.isUndefined(token) || _.isNull(token)) ){
                    event.preventDefault();
                    $state.go('ozra.actions');
                }
            });
        }

})();
