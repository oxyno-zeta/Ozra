/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 20/02/16
 * Licence: See Readme
 */
(function () {
    'use strict';

    angular
        .module('ozra.administration.groups.list')
        .controller('GroupsListAdminController', GroupsListAdminController);

    /** @ngInject */
    function GroupsListAdminController(listGroups) {
        var vm = this;
        // Variables
        vm.listGroups = listGroups;

        ////////////////

    }

})();

