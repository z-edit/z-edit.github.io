ngapp.directive('objectSchema', function() {
    return {
        restrict: 'E',
        templateUrl: '/partials/objectSchema.html',
        controller: 'objectSchemaController',
        scope: {
            basePath: '@',
            path: '@',
            schema: '=?'
        },
        replace: true
    }
});

ngapp.controller('objectSchemaController', function($scope, resourceService) {
    if ($scope.basePath) $scope.basePath = $scope.basePath.slice(4);
    if ($scope.path) {
        var basePath = $scope.basePath || '/docs/development/apis',
            path = basePath + '/'  + $scope.path;
        resourceService.get(path).then(function(schema) {
            $scope.schema = schema;
        });
    }
});
