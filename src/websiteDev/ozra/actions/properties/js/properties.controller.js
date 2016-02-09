/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 07/02/16
 * Licence: See Readme
 */

(function () {
    'use strict';

    angular
        .module('ozra.actions.properties')
        .controller('ActionsPropertiesController', ActionsPropertiesController);

    /** @ngInject */
    function ActionsPropertiesController(dataCacheService, action) {
        // Public
        var vm = this;
        // Variables
        vm.action = action;
        vm.disableEdit = true;
        vm.isFabOpen = false;
        // Functions
        vm.filterCurrentGroups = filterCurrentGroups;
        vm.fabMouseClick = fabMouseClick;
        vm.enterEditMode = enterEditMode;
        vm.leaveEditMode = leaveEditMode;

        // Private
        var currentGroups = transformToArray(dataCacheService.currentGroups);
        var actionCopy;

        ////////////////

        /**
         * Filter text in current groups
         * @param searchText
         * @returns {*|Array.<T>}
         */
        function filterCurrentGroups(searchText){
            var itemNameL;
            var searchTextL = angular.lowercase(searchText);
            return currentGroups.filter(function(item){
                itemNameL = angular.lowercase(item.name);
                return (!_.isEqual(itemNameL.indexOf(searchTextL) ,-1));
            });
        }

        /**
         * On mouse click for FAB
         */
        function fabMouseClick(){
            vm.isFabOpen = !vm.isFabOpen;
        }

        function enterEditMode(){
            // Copy action
            actionCopy = _.cloneDeep(vm.action);
            // Enable edit
            vm.disableEdit = false;
        }

        function leaveEditMode(){
            // Replace action
            vm.action = actionCopy;
            // Disable edit
            vm.disableEdit = true;
        }

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


