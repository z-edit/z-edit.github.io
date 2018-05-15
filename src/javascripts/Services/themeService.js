ngapp.service('themeService', function(resourceService) {
    var service = this;

    this.getCurrentTheme = function() {
        var theme = localStorage.getItem('theme');
        return resourceService.themes.includes(theme) ? theme : 'day';
    };

    this.getCurrentSyntaxTheme = function() {
        var theme = localStorage.getItem('syntaxTheme');
        return resourceService.syntaxThemes.includes(theme) ? theme : '';
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
            themeStylesheet.href = '/themes/' + scope.theme + '.css';
            scope.$broadcast('themeChanged', scope.theme);
        });

        scope.$watch('syntaxTheme', function() {
            var blank = scope.syntaxTheme === '';
            syntaxThemeStylesheet.href = blank ? '' : '/syntaxThemes/' + scope.syntaxTheme + '.css';
            scope.$broadcast('syntaxThemeChanged', scope.syntaxTheme);
        });

        // initialization
        scope.theme = service.getCurrentTheme();
        scope.syntaxTheme = service.getCurrentSyntaxTheme();
    }
});
