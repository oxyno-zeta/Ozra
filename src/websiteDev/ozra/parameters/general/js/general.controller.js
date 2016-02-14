/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 14/02/16
 * Licence: See Readme
 */
(function () {
    'use strict';

    angular
        .module('ozra.parameters.general')
        .controller('GeneralUserController', GeneralUserController);

    /** @ngInject */
    function GeneralUserController(currentUser, currentGroups) {
        var vm = this;
        // Variables
        vm.user = currentUser;
        vm.groups = transformToArray(currentGroups);

        ////////////////

        // Private
        /**
         * Transform object to array
         * @param obj {Object}
         * @returns {Array}
         */
        function transformToArray(obj){
            var array = [];
            var key;
            for (key in obj){
                if (obj.hasOwnProperty(key)) array.push(obj[key]);
            }
            return array;
        }
    }

})();
