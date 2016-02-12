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
    function ActionsPropertiesController($mdDialog, $mdToast, $timeout, $state,
                                         dataCacheService, actionService, action) {
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
        vm.run = run;
        vm.deleteAction = deleteAction;

        // Private
        var currentGroups = transformToArray(dataCacheService.currentGroups);
        var actionCopy;

        ////////////////

        // Public
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
         * Enter in edit mode
         */
        function enterEditMode(){
            // Copy action
            actionCopy = _.cloneDeep(vm.action);
            // Enable edit
            vm.disableEdit = false;
        }

        /**
         * Leave edit mode
         */
        function leaveEditMode(){
            // Replace action
            vm.action = actionCopy;
            // Disable edit
            vm.disableEdit = true;
        }

        /**
         * Run action
         */
        function run(){
            actionService.runFromId(action.id).then(function(response){
                // Content text : default error
                var contentText = 'Error launching action !';
                if (_.isEqual(response.result.code, 0)){
                    contentText = 'Action successfully launched !';
                }

                // Create toast
                var toast = $mdToast.simple()
                    .textContent(contentText)
                    .position('top right')
                    .action('See log ?')
                    .hideDelay(3000);

                // Show toast
                $mdToast.show(toast).then(function(_response){
                    if (_.isEqual(_response, 'ok')){
                        $mdDialog.show({
                            controller: 'ActionLogDialog',
                            controllerAs: 'actionLogDialog',
                            templateUrl: 'ozra/dialogs/actionLogDialog/actionLogDialog.html',
                            locals: {
                                result: response.result
                            },
                            clickOutsideToClose:true
                        });
                    }
                });
            }, function(err){
                if (err.hasOwnProperty('reason')) {
                    var toast = $mdToast.simple()
                        .textContent(err.reason)
                        .position('top right')
                        .hideDelay(3000);
                    // Show toast
                    $mdToast.show(toast);
                }
            });
        }

        /**
         * Delete action
         * @param event
         */
        function deleteAction(event){
            // Confirm dialog creation
            var confirm = $mdDialog.confirm()
                .title('Delete confirmation')
                .textContent('Are you sure about deleting "' + action.name + '" ?')
                .ariaLabel('Delete confirmation')
                .clickOutsideToClose(true)
                .targetEvent(event)
                .ok('Ok')
                .cancel('Cancel');

            $mdDialog.show(confirm).then(function(){
                // Ok
                actionService.deleteAction(action.id).then(function(result){
                    // Create toast
                    var toast = $mdToast.simple()
                        .textContent('Delete action succeed !')
                        .position('top right')
                        .hideDelay(1500);

                    // Show toast
                    $mdToast.show(toast);

                    // Wait a little
                    $timeout(function(){
                        $state.go('ozra.actions', null, {reload: true});
                    }, 300);
                }, function(){
                    // Create toast
                    var toast = $mdToast.simple()
                        .textContent('Delete action failed !')
                        .position('top right')
                        .hideDelay(1500);

                    // Show toast
                    $mdToast.show(toast);
                });
            });
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


