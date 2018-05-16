ngapp.config(function($stateProvider) {
    $stateProvider.state('base', {
        url: '',
        redirectTo: 'base.docs',
        templateUrl: '/partials/base.html',
        controller: 'baseController',
        resolve: {
            themes: function(resourceService) {
                return resourceService.get('resources/themes.json', 'themes');
            },
            syntaxThemes: function(resourceService) {
                return resourceService.get('resources/syntaxThemes.json', 'syntaxThemes');
            }
        }
    });
});


ngapp.controller('baseController', function($scope, themeService, modalService) {
    themeService.init($scope);
    modalService.init($scope);
});
