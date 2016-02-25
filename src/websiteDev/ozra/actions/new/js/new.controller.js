/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 10/02/16
 * Licence: See Readme
 */

(function () {
    'use strict';

    angular
        .module('ozra.actions.new')
        .controller('ActionsAddController', ActionsAddController);

    /** @ngInject */
    function ActionsAddController($mdToast, $state, dataCacheService, actionService) {
        // Public
        var vm = this;
        // Variables
        vm.action = actionService.createEmptyNew();
        vm.isFabOpen = false;
        // Functions
        vm.filterCurrentGroups = filterCurrentGroups;
        vm.fabMouseClick = fabMouseClick;
        vm.isActionComplete = isActionComplete;
        vm.save = save;

        // Private
        var currentGroups = transformToArray(dataCacheService.currentGroups);
        var actionToPost;

        ////////////////

        // Public
        /**
         * Save new action
         */
        function save(){
            // Copy action object
            actionToPost = _.cloneDeep(vm.action);
            // Transform groups
            var groupIds = [];
            _.forEach(actionToPost.groups, function(group){
                groupIds.push(group.id);
            });
            // Put it in place
            actionToPost.groups = groupIds;
            // Save action
            actionService.addNewAction(actionToPost).then(function(action){
                $state.go('ozra.actions.properties', {
                    id: action.id
                }, {reload:true});
            }, function(){
                // Create toast
                var toast = $mdToast.simple()
                    .textContent('Add action failed !')
                    .position('top right')
                    .hideDelay(1500);

                // Show toast
                $mdToast.show(toast);
            });
        }

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

        /**
         * Is Action complete
         * @returns {boolean}
         */
        function isActionComplete(){
            var action = vm.action;
            // Check name
            if (_.isUndefined(action.name) || _.isEqual(action.name, '')){
                return false;
            }
            // Check category
            if (_.isUndefined(action.category) || _.isEqual(action.category, '')){
                return false;
            }
            // Check groups
            if (_.isUndefined(action.groups)){
                return false;
            }
            if (_.isEqual(action.groups.length, 0)){
                return false;
            }
            // Check script
            if (_.isUndefined(action.script) || _.isEqual(action.script, '')){
                return false;
            }

            // Ok
            return true;
        }

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


