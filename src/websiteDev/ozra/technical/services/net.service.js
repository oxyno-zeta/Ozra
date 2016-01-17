/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 15/01/16
 * Licence: See Readme
 */

(function () {
    'use strict';

    angular
        .module('ozra.technical.services')
        .factory('netService', netService);

    /**@ngInject */
    function netService($q, Restangular) {
        var service = {
            get: get,
            post: post,
            put: put,
            remove: remove
        };
        return service;

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

    }

})();


