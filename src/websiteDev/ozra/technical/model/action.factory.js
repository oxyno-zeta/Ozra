/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 14/01/16
 * Licence: See Readme
 */
(function () {
    'use strict';

    angular
        .module('ozra.technical.model')
        .factory('actionModelFactory', actionModelFactory);

    /* @ngInject */
    function actionModelFactory() {
        var service = {
            getFromData: getFromData
        };
        return service;

        ////////////////

        /**
         * Action model
         * @constructor
         * @returns {ActionModel}
         */
        function ActionModel(data){
            // Model
            /* jshint validthis: true */
            var model = this;
            // Base
            if (_.isUndefined(data)) {
                // No data
                model.id = undefined;
                model.rev = undefined;
                model.name = undefined;
                model.category = undefined;
                model.script = undefined;
                model.application = null; // Init with nothing
                model.groups = [];
            }
            else {
                // Data detected
                model.id = data._id;
                model.rev = data._rev;
                model.name = data.name;
                model.category = data.category;
                model.script = data.script;
                model.application = data.application;
                model.groups = data.groups;
            }

            return model;
        }

        /**
         * Create Action from data
         * @param data
         * @returns {actionModelFactory.ActionModel}
         */
        function getFromData(data){
            return new ActionModel(data);
        }

    }

})();

