/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 21/02/16
 * Licence: See Readme
 */
(function () {
    'use strict';

    angular
        .module('ozra.administration.groups.edit')
        .controller('GroupEditAdminController', GroupEditAdminController);

    /** @ngInject */
    function GroupEditAdminController($mdToast, $mdDialog, $timeout, $state, groupService, group) {
        var vm = this;
        // Variables
        vm.group = group;
        vm.disableEdit = true;
        vm.isFabOpen = false;
        // Functions
        vm.deleteGroup = deleteGroup;
        vm.isGroupComplete = isGroupComplete;
        vm.save = save;
        vm.fabMouseClick = fabMouseClick;
        vm.enterEditMode = enterEditMode;
        vm.leaveEditMode = leaveEditMode;

        // Private
        var groupCopy;

        ////////////////

        /**
         * Delete group
         * @param event
         */
        function deleteGroup(event){
            // Confirm dialog creation
            var confirm = $mdDialog.confirm()
                .title('Delete confirmation')
                .textContent('Are you sure about deleting "' + group.name + '" ?')
                .ariaLabel('Delete confirmation')
                .clickOutsideToClose(true)
                .targetEvent(event)
                .ok('Ok')
                .cancel('Cancel');

            $mdDialog.show(confirm).then(function(){
                // Ok
                groupService.deleteGroup(group).then(function(result){
                    // Create toast
                    var toast = $mdToast.simple()
                        .textContent('Delete group succeed !')
                        .position('top right')
                        .hideDelay(1500);

                    // Show toast
                    $mdToast.show(toast);

                    // Wait a little
                    $timeout(function(){
                        $state.go('ozra.administration.groups', null, {reload: true});
                    }, 300);
                }, function(){
                    // Create toast
                    var toast = $mdToast.simple()
                        .textContent('Delete group failed !')
                        .position('top right')
                        .hideDelay(1500);

                    // Show toast
                    $mdToast.show(toast);
                });
            });
        }

        /**
         * Save
         */
        function save(){
            var groupToPost = _.cloneDeep(vm.group);
            // Save group
            groupService.updateGroup(groupToPost).then(function(group){
                $state.go('ozra.administration.groups.edit', {
                    id: group.id
                }, {reload:true});
            }, function(){
                // Create toast
                var toast = $mdToast.simple()
                    .textContent('Update group failed !')
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

        /**
         * Enter in edit mode
         */
        function enterEditMode(){
            // Copy
            groupCopy = _.cloneDeep(vm.group);
            // Enable edit
            vm.disableEdit = false;
        }

        /**
         * Leave edit mode
         */
        function leaveEditMode(){
            // Replace
            vm.group = groupCopy;
            // Disable edit
            vm.disableEdit = true;
        }
    }

})();
