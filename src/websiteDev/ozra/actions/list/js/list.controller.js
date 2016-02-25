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
    function ActionsListController($mdToast, $mdDialog, actionService, actions) {
        var vm = this;
        // Variables
        vm.actions = actions;
        // Functions
        vm.run = run;

        ////////////////

        /**
         * Run action
         * @param actionId
         */
        function run(actionId){
            actionService.runFromId(actionId).then(function(response){
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
                    .hideDelay(1500);

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
                        .hideDelay(1500);
                    // Show toast
                    $mdToast.show(toast);
                }
            });
        }

    }

})();


