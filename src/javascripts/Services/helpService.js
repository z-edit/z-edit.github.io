ngapp.service('helpService', function(resourceService) {
    var service = this,
        topics = [];

    // PRIVATE FUNCTIONS
    var topicExistsError = function(label) {
        return new Error('Topic ' + label + ' already exists.');
    };

    var failedToResolveTopicError = function(path) {
        return new Error('Failed to resolve help topic at path ' + path + '.');
    };

    var getTopicChildren = function(path) {
        var topic = service.getTopic(path);
        if (!topic.children) topic.children = [];
        return topic.children;
    };

    var getTopicId = function(topic) {
        return topic.id || topic.label.split(' ').filter(function(part) {
            return !part.match(/\[.+\]/);
        }).map(function(str) {
            return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
        }).join('').uncapitalize();
    };

    var processTopics = function(topics, path, parent) {
        return topics.map(function(topic) {
            var id = getTopicId(topic);
            topic.parent = parent;
            topic.templateUrl = '/' + path + '/' + id + '.html';
            if (!topic.children) return topic;
            topic.children = processTopics(topic.children, path + '/' + id, topic);
            return topic;
        });
    };

    var loadCoreTopics = function() {
        topics = processTopics(resourceService.topics, 'docs');
    };

    var loadModuleTopics = function() {
        resourceService.moduleTopics.forEach(function(t) {
            service.addTopic(t.topic, t.path);
        });
    };

    // API FUNCTIONS
    this.getTopics = function() { return topics };

    this.addTopic = function(topic, path) {
        var target = path ? getTopicChildren(path) : topics,
            existingTopic = target.findByKey('label', topic.label);
        if (existingTopic) throw topicExistsError(topic.label);
        topic.parent = service.getTopic(path);
        target.push(topic);
    };

    this.getTopic = function(path, callback) {
        var pathParts = decodeURI(path).split('/'),
            result = topics.findByKey('label', pathParts[0]);
        for (var i = 1; i < pathParts.length; i++) {
            if (!result) break;
            if (callback) callback(result);
            result = result.children.findByKey('label', pathParts[i]);
        }
        if (!result) throw failedToResolveTopicError(path);
        return result;
    };

    this.getTopicPath = function(topic) {
        if (!topic) return;
        var path = [topic.label];
        while (topic.parent) {
            path.unshift(topic.parent.label);
            topic = topic.parent;
        }
        return path.join('/');
    };

    // initialization
    loadCoreTopics();
    loadModuleTopics();
});
