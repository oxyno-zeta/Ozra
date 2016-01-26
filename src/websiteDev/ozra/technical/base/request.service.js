/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 15/01/16
 * Licence: See Readme
 */

(function () {
    'use strict';

    angular
        .module('ozra.technical.base')
        .service('requestService', requestService);

    /**@ngInject */
    function requestService($q, Restangular, dataCacheService) {
        /* jshint validthis: true */
        var self = this;

        // Export
        self.get = get;
        self.post = post;
        self.put = put;
        self.remove = remove;
        self.setDefaultParams = setDefaultParams;

        ////////////////

        /**
         * GET Request
         * @param url {string} URL
         * @param params {object} URL params
         * @param headers {object} Request headers
         * @returns {*}
         */
        function get(url, params, headers){
            var deferred = $q.defer();
            Restangular.one(url).get(params, headers).then(deferred.resolve, deferred.reject);
            return deferred.promise;
        }

        /**
         * POST Request
         * @param url {string} URL
         * @param body {object} Request body
         * @param params {object} URL params
         * @param headers {object} Request headers
         * @returns {*}
         */
        function post(url, body, params, headers){
            var deferred = $q.defer();
            Restangular.one(url).post('', body, params, headers).then(deferred.resolve, deferred.reject);
            return deferred.promise;
        }

        /**
         * PUT Request
         * @param url {string} URL
         * @param body {object} Request body
         * @param params {object} URL params
         * @param headers {object} Request headers
         * @returns {*}
         */
        function put(url, body, params, headers){
            var deferred = $q.defer();
            Restangular.one(url).customPUT(body, '', params, headers).then(deferred.resolve, deferred.reject);
            return deferred.promise;
        }

        /**
         * DELETE Request
         * @param url {string} URL
         * @param params {object} URL params
         * @param headers {object} Request headers
         * @returns {*}
         */
        function remove(url, params, headers){
            var deferred = $q.defer();
            Restangular.one(url).remove(params, headers).then(deferred.resolve, deferred.reject);
            return deferred.promise;
        }

        /**
         * Set Default params
         */
        function setDefaultParams(){
            var requestParams = {
                token: dataCacheService.token
            };
            Restangular.setDefaultRequestParams(requestParams);
        }

    }

})();


