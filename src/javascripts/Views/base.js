ngapp.config(function($stateProvider) {
    $stateProvider.state('base', {
        url: '',
        redirectTo: 'base.docs',
        templateUrl: '/partials/base.html',
        controller: 'baseController',
        resolve: resolveResources(['themes', 'syntaxThemes'])
    });
});


ngapp.controller('baseController', function($scope, themeService, modalService) {
    themeService.init($scope);
    modalService.init($scope);
});
