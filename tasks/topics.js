var gulp = require('gulp');
var jetpack = require('fs-jetpack');

gulp.task('topics', function() {
    var moduleTopics = jetpack.find('modules', {
        matching: '*',
        files: false,
        directories: true,
        recursive: false
    }).reduce(function(topics, p) {
        var topicsPath = jetpack.path(p, 'docs/topics.json');
        if (jetpack.exists(topicsPath) !== 'file') return;
        var moduleTopics = jetpack.read(topicsPath, 'json');
        moduleTopics.forEach(function(t) {
            t.topic.templateUrl = p.split('\\').join('/') +  t.topic.templateUrl;
        });
        return topics.concat(moduleTopics);
    }, []);

    jetpack.write('resources/moduleTopics.json', moduleTopics);
});