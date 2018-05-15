ngapp.directive('codeBlock', function(themeService, resourceService, codeMirrorFactory) {
    var linkFn = function(scope, element) {
        // load code
        var basePath = scope.basePath || '/docs/development/apis',
            path = basePath + '/' + scope.path;

        resourceService.load(path).then(function() {
            // attach code mirror
            var language = resourceService.getFileExt(scope.path),
                options = codeMirrorFactory.getOptions(language, true),
                textArea = element[0].firstElementChild,
                cm = CodeMirror.fromTextArea(textArea, options);
            cm.setValue(code.trimRight());

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
