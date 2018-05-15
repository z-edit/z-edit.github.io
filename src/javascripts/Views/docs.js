ngapp.config(function($stateProvider) {
    $stateProvider.state('base.docs', {
        url: '/docs',
        templateUrl: '/partials/docs.html',
        controller: 'docsController',
        resolve: {
            topics: function(resourceService) {
                return resourceService.get('resources/topics.json', 'topics');
            }
        }
    });
});

ngapp.controller('docsController', function($scope, $element, $location, $timeout, helpService, errorService) {
    // helper variables
    var containerElement = $element[0].firstElementChild;
    $element[0].className = 'docs-view';

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

    var selectInitialTopic = function() {
        var path = $location.search().t,
            topic = undefined;
        errorService.try(function() {
            topic = path && helpService.getTopic(path, expandTopic);
        });
        selectTopic(topic || $scope.topics[0]);
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
        $location.search('t', helpService.getTopicPath($scope.topic));
        if ($scope.skipHistory) {
            $scope.skipHistory = false;
            return;
        }
        $scope.history.push($scope.topic);
        $scope.historyIndex = $scope.history.length - 1;
    });

    // initialization
    $scope.xelib = {
        games: [
            {name: 'Fallout NV'},
            {name: 'Fallout 3'},
            {name: 'Oblivion'},
            {name: 'Skyrim'},
            {name: 'Skyrim SE'},
            {name: 'Fallout 4'}
        ]
    };
    $scope.topics = helpService.getTopics();
    $timeout(selectInitialTopic, 100);
});
