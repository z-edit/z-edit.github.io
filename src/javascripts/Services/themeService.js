ngapp.service('themeService', function(resourceService) {
    var service = this;

    this.getCurrentTheme = function() {
        var filename = localStorage.getItem('theme'),
            theme = resourceService.themes.findByKey('filename', filename);
        return theme ? theme.filename : 'day.css';
    };

    this.getCurrentSyntaxTheme = function() {
        var filename = localStorage.getItem('syntaxTheme'),
            theme = resourceService.syntaxThemes.findByKey('filename', filename);
        return theme ? theme.filename : '';
    };

    this.setCurrentTheme = function(themeFileName) {
        localStorage.setItem('theme', themeFileName);
    };

    this.setCurrentSyntaxTheme = function(themeFileName) {
        localStorage.setItem('syntaxTheme', themeFileName);
    };

    this.getThemeName = function(filename, defaultName) {
        var match = filename.match(/(.*)\.css/);
        return match ? match[1] : defaultName || '';
    };

    this.init = function(scope) {
        var themeStylesheet = document.getElementById('theme'),
            syntaxThemeStylesheet = document.getElementById('syntaxTheme');

        // event listeners
        scope.$on('setTheme', function(e, theme) {
            scope.theme = theme;
        });
        scope.$on('setSyntaxTheme', function(e, theme) {
            scope.syntaxTheme = theme;
        });

        scope.$watch('theme', function() {
            themeStylesheet.href = '/themes/' + scope.theme;
            scope.$broadcast('themeChanged', scope.theme);
        });

        scope.$watch('syntaxTheme', function() {
            syntaxThemeStylesheet.href = scope.syntaxTheme === '' ?
                '' : '/syntaxThemes/' + scope.syntaxTheme;
            scope.$broadcast('syntaxThemeChanged', scope.syntaxTheme);
        });

        // initialization
        scope.theme = service.getCurrentTheme();
        scope.syntaxTheme = service.getCurrentSyntaxTheme();
    }
});
