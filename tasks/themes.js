var gulp = require('gulp');
var jetpack = require('fs-jetpack');

var unknownMetaData = {
    author: 'Unknown',
    released: '?',
    updated: '?',
    description: 'This theme does not have embedded metadata.'
};

var extractThemeName = function(filename) {
    var match = filename.match(/(.*)\.css/);
    return match ? match[1] : '';
};

var loadTheme = function(filePath) {
    var fileContents = jetpack.read(filePath),
        filename = filePath.split('\\').pop(),
        match = fileContents.match(new RegExp(/^\/\*\{([\w\W]+)\}\*\//)),
        metaData = Object.assign(unknownMetaData, {
            name: extractThemeName(filename)
        });
    try {
        if (match) metaData = JSON.parse('{' + match[1] + '}');
    } catch (x) {
        console.log('Error parsing metadata for theme ' + filename + ':' + x.message);
    }
    metaData.filename = filename;
    return metaData;
};

var updateSyntaxThemes = function() {
    var themes = jetpack.find('syntaxThemes', {
        matching: '*.css'
    }).map(function(filePath) {
        var filename = filePath.split('\\').pop();
        return {
            filename: filename,
            name: extractThemeName(filename)
        }
    });

    jetpack.write('resources/syntaxThemes.json', themes);
};

var updateThemes = function() {
    var themes = jetpack.find('themes', {
        matching: '*.css'
    }).map(function(filePath) {
        return loadTheme(filePath);
    });

    jetpack.write('resources/themes.json', themes);
};

gulp.task('themes', function() {
    gulp.src('node_modules/codemirror/theme/*.css')
        .pipe(gulp.dest('syntaxThemes'));

    updateSyntaxThemes();
    updateThemes();
});