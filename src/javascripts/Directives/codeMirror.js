ngapp.directive('codeMirror', function($timeout, themeService, codeMirrorFactory) {
    return {
        restrict: 'A',
        require: '?ngModel',
        compile: function() {
            return function (scope, element, attrs, ngModel) {
                var options = codeMirrorFactory.getOptions(attrs.codeMirror || 'js'),
                    cm = CodeMirror.fromTextArea(element[0], options);

                // ng model data binding
                ngModel.$render = function() { cm.setValue(ngModel.$viewValue || ''); };
                cm.on('change', function() {
                    var newValue = cm.getValue();
                    scope.$evalAsync(function() { ngModel.$setViewValue(newValue) });
                });

                // event handling
                scope.$on('refresh', function() { $timeout(cm.refresh) });
                scope.$on('syntaxThemeChanged', function(e, theme) {
                    var themeName = themeService.getThemeName(theme, 'default');
                    cm.setOption('theme', themeName);
                    cm.refresh();
                });
            };
        }
    }
});
