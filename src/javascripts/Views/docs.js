ngapp.config(function($stateProvider) {
    $stateProvider.state('docs', {
        url: '',
        templateUrl: '/partials/docs.html',
        controller: 'docsController',
        resolve: {
            themes: function(resourceService) {
                return resourceService.get('resources/themes.json', 'themes');
            },
            syntaxThemes: function(resourceService) {
                return resourceService.get('resources/syntaxThemes.json', 'syntaxThemes');
            },
            topics: function(resourceService) {
                return resourceService.get('resources/topics.json', 'topics');
            }
        }
    });
});

ngapp.controller('docsController', function($scope, $element, helpService, errorService, themeService) {
    // helper variables
    var containerElement = $element[0].firstElementChild;

    $scope.history = [];
    $scope.historyIndex = -1;

    // helper functions
    var selectTopic = function(topic) {
        if ($scope.topic) $scope.topic.selected = false;
        $scope.topic = topic;
        topic.selected = true;
    };

    var expandTopic = function(topic) {
        $scope.$broadcast('expandTreeNode', topic);
    };

    // scope functions
    $scope.navigateTo = function(path) {
        selectTopic(helpService.getTopic(path, expandTopic));
    };

    $scope.historyGo = function() {
        $scope.skipHistory = true;
        selectTopic($scope.history[$scope.historyIndex]);
    };

    $scope.back = function() {
        if ($scope.historyIndex <= 0) return;
        $scope.historyIndex--;
        $scope.historyGo();
    };

    $scope.forward = function() {
        if ($scope.historyIndex === $scope.history.length - 1) return;
        $scope.historyIndex++;
        $scope.historyGo();
    };

    // event listeners
    $scope.$on("helpNavigateTo", function(e, path) {
        $scope.$applyAsync(function() {
            errorService.try(function() {
                $scope.navigateTo(path);
            });
        });
    });

    $scope.$on('navigateToChild', function(e, child) {
        $scope.$broadcast('expandTreeNode', $scope.topic);
        selectTopic(child);
        e.stopPropagation && e.stopPropagation();
    });

    $scope.$watch('topic', function() {
        containerElement.scrollTop = 0;
        if ($scope.skipHistory) {
            $scope.skipHistory = false;
            return;
        }
        $scope.history.push($scope.topic);
        $scope.historyIndex = $scope.history.length - 1;
    });

    // initialization
    themeService.init($scope);
    $scope.topics = helpService.getTopics();
    selectTopic($scope.topics[0]);
});
