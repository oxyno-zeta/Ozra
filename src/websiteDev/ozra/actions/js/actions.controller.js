/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 02/02/16
 * Licence: See Readme
 */

(function () {
    'use strict';

    angular
        .module('ozra.actions')
        .controller('ActionsController', ActionsController);

    /* @ngInject */
    function ActionsController() {
        var vm = this;
        vm.title = 'ActionsController';

        activate();

        ////////////////

        function activate() {
            //
        }
    }

})();


