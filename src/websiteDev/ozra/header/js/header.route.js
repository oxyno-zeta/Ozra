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
            abstract: true,
            views: {
                content: {
                    templateUrl: 'ozra/header/header.html',
                    controller: 'HeaderController',
                    controllerAs: 'headerCtrl'
                }
            },
            resolve: {
                currentUser: function(userService){
                    return userService.getCurrentFromId();
                },
                currentGroups: function(groupService){
                    return groupService.getCurrentUserGroups();
                }
            }
        });
    }

})();
