/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 26/01/16
 * Licence: See Readme
 */

(function () {
    'use strict';

    angular
        .module('ozra.header')
        .controller('HeaderController', HeaderController);

    /** @ngInject */
    function HeaderController($state, groupService, currentUser, currentGroups) {
        var vm = this;
        // Variables
        vm.isAdmin = groupService.isOneGroupAdministrator(currentGroups);
        // Functions

        activate();

        ////////////////

        function activate() {
            //
            console.log(currentGroups);
            console.log(currentUser);
        }
    }

})();
