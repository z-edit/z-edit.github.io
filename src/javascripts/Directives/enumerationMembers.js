ngapp.directive('enumerationMembers', function() {
    return {
        restrict: 'E',
        templateUrl: '/partials/enumerationMembers.html',
        scope: {
            members: '='
        },
        replace: true
    }
});
