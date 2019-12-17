ngapp.directive('functionOptions', function() {
    return {
        restrict: 'E',
        templateUrl: 'partails/functionOptions.html',
        scope: {
            options: '='
        },
        replace: true
    }
});
