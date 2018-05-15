ngapp.service('resourceService', function($q, $http) {
    var service = this;

    var getBasePath = function() {
        var n = location.pathname.indexOf('/docs');
        return '/' + location.pathname.slice(0, n);
    };

    var basePath = getBasePath();

    var retrieveResource = function(action, path, name) {
        $http.get(path).then(function(r) {
            service[name] = r.data;
            action.resolve(r.data);
        }, function() {
            var error = 'Failed to load resource at ' + path;
            alert(error);
            action.reject(error);
        });
    };

    this.get = function(path, name) {
        var action = $q.defer();
        if (path[0] === '/') path = path.slice(1);
        path = basePath + path;
        if (!name) name = path;
        service.hasOwnProperty(name) ?
            action.resolve(service[name]) :
            retrieveResource(action, path, name);
        return action.promise;
    };
});