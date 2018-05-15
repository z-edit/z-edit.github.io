ngapp.service('codeMirrorFactory', function(themeService) {
    var options = {
        js: { mode: 'javascript' },
        html: { mode: 'htmlmixed' }
    };

    this.getOptions = function(label, readOnly) {
        var filename = themeService.getCurrentSyntaxTheme();
        return Object.assign({}, options[label], {
            theme: themeService.getThemeName(filename, 'default'),
            lineNumbers: !readOnly,
            readOnly: !!readOnly,
            scrollbarStyle: readOnly ? null : 'native',
            lineWrapping: true
        });
    };
});
