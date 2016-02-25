/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 21/02/16
 * Licence: See Readme
 */
(function () {
    'use strict';

    angular
        .module('ozra.administration.groups.new')
        .controller('GroupNewAdminController', GroupNewAdminController);

    /** @ngInject */
    function GroupNewAdminController($state, $mdToast, groupService) {
        var vm = this;
        // Variables
        vm.isFabOpen = false;
        vm.group = groupService.createEmptyNew();
        // Functions
        vm.isGroupComplete = isGroupComplete;
        vm.save = save;
        vm.fabMouseClick = fabMouseClick;

        // Private
        var groupToPost;

        ////////////////

        /**
         * Save
         */
        function save(){
            groupToPost = _.cloneDeep(vm.group);
            // Post new group
            groupService.addNewGroup(groupToPost).then(function(group){
                // Ok
                $state.go('ozra.administration.groups.edit', {
                    id: group.id
                }, {reload:true});
            }, function(){
                // Create toast
                var toast = $mdToast.simple()
                    .textContent('Add group failed !')
                    .position('top right')
                    .hideDelay(1500);

                // Show toast
                $mdToast.show(toast);
            });
        }

        /**
         * Check if group complete
         * @returns {boolean}
         */
        function isGroupComplete(){
            var group = vm.group;

            if (_.isUndefined(group.name) || _.isEqual(group.name, '')){
                return false;
            }

            if (_.isUndefined(group.administrator) || !_.isBoolean(group.administrator)){
                return false;
            }

            return true; // default ok
        }

        /**
         * On mouse click for FAB
         */
        function fabMouseClick(){
            vm.isFabOpen = !vm.isFabOpen;
        }
    }

})();
