(function () {
    'use strict';

    angular.module('main')
    .service('BookService', function ($http) {

        var urlBase = '/book';

        this.getAll = function () {
            return $http.get(urlBase, { 
                    params: { 
                        page: 0, 
                        size: 1000
                    }
                });
        };  

        this.get = function (id) {
            return $http.get(urlBase + '/' + id);
        };

        this.new = function (dev) {
            return $http.post(urlBase, dev); 
        };

        this.update = function (dev) {
            return $http.put(urlBase, dev)
        };

        this.delete = function (id) {
            return $http.delete(urlBase, { 
                    params: { 
                        id: id
                    }
                }); 
        };

        this.getPage = function (page, size, name, publisherName, authorName) {
            return $http.get(urlBase, { 
                    params: { 
                        publisherName: publisherName,
                        authorName: authorName,
                        name: name,
                        page: page, 
                        size: size 
                    }
            });
        };

        this.uploadImage = function (file, id) {
            var fd = new FormData();
            fd.append('file', file);

            return $http.post(urlBase + '/upload', fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined },
                params: { id: id }
            });
        }

        this.getLogo = function (id) {
            return $http.get(urlBase + '/image', { 
                    params: { 
                        id: id
                    }
            });
        }
    });

})();
