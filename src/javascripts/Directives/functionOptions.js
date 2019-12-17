ngapp.directive('functionOptions', function() {
    return {
        restrict: 'E',
        templateUrl: '/partials/functionOptions.html',
        scope: {
            options: '='
        },
        replace: true
    }
});
