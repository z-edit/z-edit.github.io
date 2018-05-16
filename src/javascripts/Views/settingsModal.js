ngapp.controller('settingsModalController', function($scope, $timeout, resourceService, themeService) {
    // initialization
    $scope.themes = resourceService.themes;
    $scope.syntaxThemes = resourceService.syntaxThemes;

    $scope.theme = $scope.themes
        .findByKey('filename', themeService.getCurrentTheme());

    $scope.syntaxTheme = $scope.syntaxThemes
        .findByKey('filename', themeService.getCurrentSyntaxTheme()) || '';

    $scope.sampleCode = [
        'function foo(bar) {',
        '    if (bar == 1) {',
        '        return "Foobar";',
        '    } else if (bar > 1) {',
        '        return false;',
        '    } else {',
        '        return foo(bar + 1);',
        '    }',
        '}'
    ].join('\r\n');

    // helper functions
    var setSyntaxTheme = function(name) {
        var syntaxTheme = $scope.syntaxThemes.findByKey('name', name);
        if (name === '' || syntaxTheme) {
            $scope.syntaxTheme = syntaxTheme;
            $scope.syntaxThemeChanged();
        } else {
            console.log('Couldn\'t find preferred syntax theme ' + name);
        }
    };

    // scope functions
    $scope.themeChanged = function() {
        themeService.setCurrentTheme($scope.theme.filename);
        $scope.$emit('setTheme', $scope.theme.filename);
        $timeout(function() { setSyntaxTheme($scope.theme.syntaxTheme); }, 100);
    };

    $scope.syntaxThemeChanged = function() {
        var syntaxTheme = $scope.syntaxTheme && $scope.syntaxTheme.filename;
        themeService.setCurrentSyntaxTheme(syntaxTheme || '');
        $scope.$emit('setSyntaxTheme', syntaxTheme || '');
    };
});
