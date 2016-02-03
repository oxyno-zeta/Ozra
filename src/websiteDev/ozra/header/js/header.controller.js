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
    function HeaderController(groupService, currentGroups) {
        var vm = this;
        // Variables
        vm.isAdmin = groupService.isOneGroupAdministrator(currentGroups);
        // Functions

        ////////////////
    }

})();
