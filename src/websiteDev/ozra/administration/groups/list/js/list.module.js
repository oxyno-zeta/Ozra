/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 20/02/16
 * Licence: See Readme
 */
(function () {
    'use strict';

    angular
        .module('ozra.administration.groups.list', [])
        .run(function($rootScope){
            $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error){
                console.log(error);
            });
        });

})();
