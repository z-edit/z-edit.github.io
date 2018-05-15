// start polyfills
//=include src/javascripts/polyfills.js
// end polyfills

var ngapp = angular.module('zeditDocs', [
    'ui.router', 'hc.marked'
]);

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