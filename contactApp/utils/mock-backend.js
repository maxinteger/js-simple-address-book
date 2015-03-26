(function(_, angular){
    'use strict';

    angular.module('ContactApp.mock', ['ngStorage'])
    /**
     * This interceptor mock every $http calls that starts with /api/
     */
        .factory('mockInterceptor', function mockInterceptor($q, $localStorage) {
            return {
                /**
                 * Request interceptor
                 *
                 * @param {object}config   xhr configuration
                 * @returns {object|promise}
                 */
                request: function (config) {
                    // First of all we reject the '/api/*' calls, before they reach the server
                    if (config.url.startsWith('/api/')){
                        return $q.reject(config);
                    } else {
                        return config || $q.when(config);
                    }
                },

                /**
                 * Response error interceptor
                 * Parse call url and if it is match to the /api/* patter we resolve the request from the local storage
                 *
                 * @param {object}rejection     Rejection parameters OR the xhr configuration
                 * @returns {promise}
                 */
                responseError: function (rejection) {
                    var url = rejection.url || rejection.config.url;

                    // check url
                    if (url.startsWith('/api/')){
                        // get the modelName and id from the url
                        // ex: /api/contacts/123 -> modelName='contacts', id:123
                        var path = url.match(/^\/api\/(.*?)(?:\/(\d*)\/?)?$/),
                            modelName = path[1],
                            id = path[2],           // might be undefined
                            config = rejection,
                            value = null;           // return value

                        // set model default value in local storage
                        $localStorage.$default(_.object([[modelName, {}]]));

                        // route methods
                        switch(config.method ){
                            case 'GET':
                                // if no id we return with the whole data set otherwise just one entity
                                value = id ? $localStorage[modelName][id] : _.values($localStorage[modelName]);
                                break;
                            case 'POST':
                                var data = config.data.toJSON ? config.data.toJSON() : config.data;
                                // if no id in entity we create a new unique id
                                data.id = data.id || _.uniqueId(+new Date());
                                // save entity
                                $localStorage[modelName][data.id] = _.cloneDeep(data);
                                value = data;
                                break;
                            case 'DELETE':
                                // delete entity from storage
                                if (id){
                                    delete $localStorage[modelName][id];
                                }
                                break;
                        }
                        // Return with a valid angular response object
                        return $q.when({
                            config: config,
                            headers: function(){return {}; },
                            status: 200,
                            statusText: 'OK',
                            data: value
                        });
                    }
                }
            };
        })

        .config( function($httpProvider){
            // add mock interceptor to the httpProvider
            $httpProvider.interceptors.push('mockInterceptor');
        });
})(_, angular);
