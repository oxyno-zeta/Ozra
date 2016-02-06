/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 02/02/16
 * Licence: See Readme
 */

(function () {
    'use strict';

    angular
        .module('ozra.actions.list')
        .controller('ActionsListController', ActionsListController);

    /* @ngInject */
    function ActionsListController(actions) {
        var vm = this;
        // Variables
        vm.actions = actions;

        ////////////////

    }

})();


