/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 21/01/16
 * Licence: See Readme
 */

(function () {
    'use strict';

    angular
        .module('ozra.header')
        .config(routeConfig);

    /* @ngInject */
    function routeConfig ($stateProvider) {
        $stateProvider.state('ozra', {
            url: '/ozra',
            views: {
                content: {
                    templateUrl: 'ozra/header/header.html'
                }
            },
            resolve: {
                currentUser: function(userService){
                    return userService.getCurrentFromId();
                }
            }
        });
    }

})();
