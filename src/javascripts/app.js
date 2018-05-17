// start polyfills
//=include src/javascripts/polyfills.js
// end polyfills

var ngapp = angular.module('zeditSite', [
    'ui.router', 'ct.ui.router.extras', 'hc.marked'
]);

var resolveResources = function(resourceNames) {
    return resourceNames.reduce(function(obj, name) {
        obj[name] = function(resourceService) {
            return resourceService.get('resources/' + name + '.json', name);
        };
        return obj;
    }, {});
};

ngapp.config(function($compileProvider) {
    // allow docs:// urls
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|docs):/);
});

//== begin angular files ==
//=include src/javascripts/Directives/*.js
//=include src/javascripts/Factories/*.js
//=include src/javascripts/Filters/*.js
//=include src/javascripts/Services/*.js
//=include src/javascripts/Views/*.js
//== end angular files ==

ngapp.run(function($rootScope, protocolService) {
    protocolService.init($rootScope);
});

// state redirects
ngapp.run(['$rootScope', '$state', function($rootScope, $state) {
    $rootScope.$on('$stateChangeStart', function (e, toState, params) {
        if (!toState.redirectTo) return;
        e.preventDefault();
        $state.go(toState.redirectTo, params, { location: 'replace' });
    });
}]);
