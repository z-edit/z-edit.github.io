ngapp.directive('codeBlock', function($timeout, themeService, resourceService, codeMirrorFactory) {
    var linkFn = function(scope, element) {
        // load code
        var basePath = scope.basePath || '/docs/development/apis',
            path = basePath + '/' + scope.path;

        var getFileExt = function(path) {
            return path.match(/.*\.(.*)/)[1];
        };

        resourceService.get(path).then(function(code) {
            // attach code mirror
            var language = getFileExt(scope.path),
                options = codeMirrorFactory.getOptions(language, true),
                textArea = element[0].firstElementChild,
                cm = CodeMirror.fromTextArea(textArea, options);
            cm.setValue(code.trimRight());
            $timeout(function() { cm.refresh() }, 100);

            // event handling
            scope.$on('syntaxThemeChanged', function(e, theme) {
                var themeName = themeService.getThemeName(theme, 'default');
                cm.setOption('theme', themeName);
                cm.refresh();
            });
        });
    };

    return {
        restrict: 'E',
        scope: {
            basePath: '@',
            path: '@'
        },
        template: '<textarea></textarea>',
        link: linkFn
    }
});
