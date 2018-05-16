(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// start polyfills
String.prototype.uncapitalize = function() {
    return this.charAt(0).toLowerCase() + this.slice(1);
};

String.prototype.toCamelCase = function() {
    return this.uncapitalize().replace(/(\s|\-|\_|\.)+(.)/g, function(match) {
        return match.slice(-1).toUpperCase();
    });
};

String.prototype.underscore = function(separator) {
    if (separator === undefined) separator = '_';
    return this.toCamelCase().replace(/[A-Z]/g, function(match) {
        return separator + match.toLowerCase();
    })
};

String.prototype.wordCount = function() {
    if (this.length) {
        var match = this.match(/(\S+)/g);
        return (match && match.length) || 0;
    } else {
        return 0;
    }
};

String.prototype.wordwrap = function(width = 60, brk = '\n', cut = false) {
    if (this.length === 0) return this;
    var cutExpr = cut ? '|.' + width + '}|.+$' : '|\\S+?(\\s|$)',
        expr = '.{1,' + width + '}(\\s|$)' + cutExpr + '}';
    return this.match(new RegExp(expr, 'g')).map(function(str) {
        return str.trim()
    }).join(brk);
};

Array.prototype.findByKey = function(key, value) {
    return this.find(function(item) {
        return item[key] === value
    });
};
// end polyfills

var ngapp = angular.module('zeditDocs', [
    'ui.router', 'hc.marked'
]);

ngapp.config(function($compileProvider) {
    // allow docs:// urls
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|docs):/);
});

//== begin angular files ==
ngapp.directive('apiItems', function() {
    return {
        restrict: 'E',
        scope: {},
        templateUrl: '/partials/apiItems.html',
        controller: 'apiItemsController',
        controllerAs: 'vm',
        bindToController: {
            api: '@',
            basePath: '@',
            path: '@',
            items: '=?',
            depth: '=?'
        }
    }
});

ngapp.controller('apiItemsController', function(resourceService) {
    var ctrl = this;
    ctrl.tintBg = (ctrl.depth || 0) % 2 === 0;

    var buildItems = function(items) {
        ctrl.items = items.map(function(item) {
            if (!item.type) item.type = 'function';
            item.isEvent = item.type === 'event';
            return item;
        });
    };

    if (ctrl.basePath) ctrl.basePath = ctrl.basePath.slice(4);

    if (ctrl.path) {
        var basePath = ctrl.basePath || '/docs/development/apis',
            path = basePath + '/' + ctrl.path;
        resourceService.get(path).then(function(items) {
            if (items) buildItems(items);
        });
    }

    if (ctrl.items) buildItems(ctrl.items);
});

ngapp.directive('childrenTopics', function() {
    return {
        restrict: 'E',
        scope: false,
        templateUrl: '/partials/childrenTopics.html'
    }
});

ngapp.directive('codeBlock', function(themeService, resourceService, codeMirrorFactory) {
    var linkFn = function(scope, element) {
        // load code
        var basePath = scope.basePath || '/docs/development/apis',
            path = basePath + '/' + scope.path;

        resourceService.get(path).then(function() {
            // attach code mirror
            var language = getFileExt(scope.path),
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

ngapp.directive('dynController', function($controller, $parse) {
    var getController = function(ctrlName, scope, element, attrs) {
        return $controller(ctrlName, {
            $scope: scope,
            $element: element,
            $attrs: attrs
        });
    };

    var resolveController = function(ctrlExpr, scope, element, attrs) {
        var ctrl = $parse(ctrlExpr)(scope);
        return ctrl && getController(ctrl, scope, element, attrs);
    };

    return {
        restrict: 'A',
        scope: true,
        link: function(scope, element, attrs) {
            attrs.$observe('dynController', function(ctrlExpr) {
                var controller = resolveController(ctrlExpr, scope, element, attrs);
                if (!controller) return;
                element.data('$Controller', controller);
            });
        }
    }
});

ngapp.directive('enumerationMembers', function() {
    return {
        restrict: 'E',
        templateUrl: '/partials/enumerationMembers.html',
        scope: {
            members: '='
        },
        replace: true
    }
});

ngapp.directive('modalViewsList', function() {
    return {
        restrict: 'E',
        scope: false,
        templateUrl: '/partials/modalViewsList.html'
    }
});

ngapp.directive('objectSchema', function() {
    return {
        restrict: 'E',
        templateUrl: '/partials/objectSchema.html',
        controller: 'objectSchemaController',
        scope: {
            basePath: '@',
            path: '@',
            schema: '=?'
        },
        replace: true
    }
});

ngapp.controller('objectSchemaController', function($scope, resourceService) {
    if ($scope.basePath) $scope.basePath = $scope.basePath.slice(4);
    if ($scope.path) {
        var basePath = $scope.basePath || '/docs/development/apis',
            path = basePath + '/'  + $scope.path;
        resourceService.get(path).then(function(schema) {
            $scope.schema = schema;
        });
    }
});

ngapp.directive('tree', function() {
    return {
        restrict: 'E',
        templateUrl: '/partials/tree.html',
        transclude: true,
        scope: {
            items: '=',
            selectedItem: '='
        },
        controller: 'treeController'
    }
});

ngapp.controller('treeController', function($scope) {
    // helper functions
    var selectItem = function(item) {
        if ($scope.selectedItem) $scope.selectedItem.selected = false;
        $scope.selectedItem = item;
        item.selected = true;
    };

    var buildNode = function(item, parentDepth) {
        item.depth = parentDepth + 1;
        item.can_expand = item.children && item.children.length > 0;
    };

    var collapseNode = function(item) {
        if (!item.expanded) return;
        delete item.expanded;
        var startIndex = $scope.items.indexOf(item) + 1,
            endIndex = startIndex;
        for (; endIndex < $scope.items.length; endIndex++) {
            var child = $scope.items[endIndex];
            if (child.depth <= item.depth) break;
        }
        $scope.items.splice(startIndex, endIndex - startIndex);
    };

    var expandNode = function(item) {
        if (item.expanded) return;
        var insertionIndex = $scope.items.indexOf(item) + 1;
        item.children.forEach(function(child) {
            buildNode(child, item.depth)
        });
        var spliceArgs = [insertionIndex, 0].concat(item.children);
        Array.prototype.splice.apply($scope.items, spliceArgs);
        item.expanded = true;
    };

    // scope functions
    $scope.onTreeItemClick = function(e, item) {
        selectItem(item);
        e.stopPropagation();
    };

    $scope.toggleExpanded = function(e, item) {
        (item.expanded ? collapseNode : expandNode)(item);
        e.stopPropagation();
    };

    // event handlers
    $scope.$on('expandTreeNode', function(e, item) {
        expandNode(item);
    });

    $scope.$on('collapseTree', function() {
        for (var i = $scope.items.length - 1; i >= 0; i--) {
            var item = $scope.items[i];
            if (item.expanded) collapseNode(item);
        }
    });

    // initialization
    $scope.items.forEach(function(item) {
        buildNode(item, -1);
    });
});

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

ngapp.service('errorResolutionFactory', function() {
    // PRIVATE
    var ignoreResolution = {
        label: 'Ignore',
        class: 'neutral',
        description: 'This resolution will leave the error in the plugin.'
    };

    var removeRecordResolution = {
        label: 'Delete',
        class: 'negative',
        description: 'This resolution will remove the record from the plugin.'
    };

    var tweakEdidResolution = {
        label: 'Tweak EDID',
        class: 'positive',
        availability: 'When the record has an Editor ID.',
        description: 'This resolution will adjusted the EditorID of the record so it is no longer an ITM.'
    };

    var tweakPositionResolution = {
        label: 'Tweak Position',
        class: 'positive',
        availability: 'When the record is a placed object.',
        description: 'This resolution will slightly adjust the position of the reference so it is no longer an ITM.'
    };

    var nullifyResolution = {
        label: 'Nullify',
        class: 'positive',
        availability: 'When the element allows NULL references.',
        description: 'This resolution will set the reference to a NULL [00000000] reference.'
    };

    var removeResolution = {
        label: 'Remove',
        class: 'negative',
        description: 'This resolution will remove the error element from the record.'
    };

    var repairResolution = {
        label: 'Repair',
        class: 'positive',
        description: 'This resolution will fix the order of subrecords in the record and trim invalid ones.'
    };

    var replaceNavmeshResolution = {
        label: 'Replace Navmesh',
        class: 'positive',
        availability: 'When the record is a navmesh and a replacement navmesh is present.',
        description: 'This resolution will replace the deleted navmesh with the new navmesh introduced by the plugin.'
    };

    var buryNavmeshResolution = {
        label: 'Bury Navmesh',
        class: 'positive',
        availability: 'When the record is a navmesh.',
        description: 'This resolution will lower the navmesh\'s verticies below the ground and remove its edge links.'
    };

    var undeleteAndDisableResolution = {
        label: 'Undelete and Disable',
        class: 'positive',
        availability: 'When the record is a placed object.',
        description: 'This resolution will undelete the reference and mark it as disabled.'
    };

    var clearSubrecordsResolution = {
        label: 'Clear Subrecords',
        color: 'positive',
        availability: 'When the record is not a placed object or a navmesh.',
        description: 'This resolution will clear the record\'s subrecords.'
    };

    var restoreResolution = {
        label: 'Restore',
        class: 'negative',
        description: 'This resolution will restore the record.  You should not use this resolution unless you know exactly what you\'re doing!'
    };

    var identicalResolutions = [removeRecordResolution, tweakEdidResolution,
        tweakPositionResolution, ignoreResolution];

    // PUBLIC
    this.errorResolutions = {
        ITM: identicalResolutions,
        ITPO: identicalResolutions,
        DR: [replaceNavmeshResolution, buryNavmeshResolution,
            undeleteAndDisableResolution, clearSubrecordsResolution,
            restoreResolution, ignoreResolution],
        UES: [repairResolution, removeRecordResolution, ignoreResolution],
        URR: [nullifyResolution, removeResolution, ignoreResolution],
        UER: [nullifyResolution, removeResolution, ignoreResolution],
        OE: [ignoreResolution]
    };

    this.ignoreResolution = ignoreResolution;
});

ngapp.service('errorTypeFactory', function () {
    this.errorTypes = function () {
        return [
            {
                group: 0,
                name: "Identical to Master Records",
                acronym: "ITM",
                caption: "ITMs are records that have been overridden in a plugin file but haven't been change relative to their master record.",
                benign: true,
                errors: []
            },
            {
                group: 1,
                name: "Identical to Previous Override Records",
                acronym: "ITPO",
                caption: "ITPOs are records that have been overridden in a plugin file that haven't been changed relative to their previous override.",
                benign: true,
                errors: []
            },
            {
                group: 2,
                name: "Deleted Records",
                acronym: "DR",
                caption: "DRs are records which have been marked as deleted with either their subrecords still present or the chance to cause CTDs when referenced.",
                errors: []
            },
            {
                group: 3,
                name: "Unexpected Subrecords",
                acronym: "UES",
                caption: "UESs are errors where the data structure of a record is abnormal.",
                benign: true,
                errors: []
            },
            {
                group: 4,
                name: "Unresolved References",
                acronym: "URR",
                caption: "URRs are errors where a record references another record that doesn't exist.",
                benign: true,
                errors: []
            },
            {
                group: 5,
                name: "Unexpected References",
                acronym: "UER",
                caption: "UERs are errors where a record references another record in an abnormal fashion.",
                benign: true,
                errors: []
            },
            {
                group: 6,
                name: "Other Errors",
                acronym: "OE",
                caption: "Errors that don't fall into the other groups are placed in this group.",
                benign: true,
                errors: []
            }
        ];
    };
});

ngapp.filter('classify', function() {
    return function(str) {
        if (typeof str !== 'string') return '';
        return str.underscore('-');
    }
});

ngapp.filter('wordwrap', function() {
    return function(str, width) {
        if (typeof str !== 'string') return '';
        return str.wordwrap(width || 60);
    };
});
ngapp.service('errorService', function($exceptionHandler) {
    this.try = function(callback) {
        try {
            callback();
            return true;
        } catch(x) {
            $exceptionHandler(x)
        }
    };
});

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

    var processTopics = function(topics, path) {
        return topics.map(function(topic) {
            var id = getTopicId(topic);
            topic.templateUrl = '/' + path + '/' + id + '.html';
            if (!topic.children) return topic;
            topic.children = processTopics(topic.children, path + '/' + id);
            return topic;
        });
    };

    var loadCoreTopics = function() {
        topics = processTopics(resourceService.topics, 'docs');
    };

    // API FUNCTIONS
    this.getTopics = function() { return topics };

    this.addTopic = function(topic, path) {
        var target = path ? getTopicChildren(path) : topics,
            existingTopic = target.findByKey('label', topic.label);
        if (existingTopic) throw topicExistsError(topic.label);
        target.push(topic);
    };

    this.getTopic = function(path, callback) {
        var pathParts = path.split('/'),
            result = topics.findByKey('label', pathParts[0]);
        for (var i = 1; i < pathParts.length; i++) {
            if (!result) break;
            if (callback) callback(result);
            result = result.children.findByKey('label', pathParts[i]);
        }
        if (!result) throw failedToResolveTopicError(path);
        return result;
    };

    // initialization
    loadCoreTopics()
});

ngapp.service('protocolService', function($document) {
    this.init = function(scope) {
        var handleDocsLink = function(href) {
            scope.$broadcast('helpNavigateTo', href.substr(7));
        };

        var protocolHandlers = {
            docs: handleDocsLink
        };

        var handleLink = function(href) {
            var protocol = href.match(/([^:]+)/)[1],
                handler = protocolHandlers[protocol];
            handler && handler(href);
            return !!handler;
        };

        // handle link protocols properly
        $document.bind('click', function(event) {
            if (event.target.tagName !== 'A') return;
            if (!event.target.href) return;
            if (handleLink(event.target.href)) event.preventDefault();
        });
    };
});

ngapp.service('resourceService', function($q, $http) {
    var service = this;

    var retrieveResource = function(action, path, name) {
        $http.get(path).then(function(r) {
            service[name] = r.data;
            action.resolve(r.data);
        }, function() {
            var error = 'Failed to load resource at ' + path;
            alert(error);
            action.reject(error);
        });
    };

    this.get = function(path, name) {
        var action = $q.defer();
        if (path[0] !== '/') path = '/' + path;
        if (!name) name = path;
        service.hasOwnProperty(name) ?
            action.resolve(service[name]) :
            retrieveResource(action, path, name);
        return action.promise;
    };
});
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
    themeService.init($scope);
    $scope.topics = helpService.getTopics();
    selectTopic($scope.topics[0]);
});

ngapp.controller('resolveModalDocumentationController', function($scope, errorTypeFactory, errorResolutionFactory) {
    $scope.errorTypes = errorTypeFactory.errorTypes();
    $scope.resolutions = errorResolutionFactory.errorResolutions;
});
//== end angular files ==

ngapp.run(function($rootScope, protocolService) {
    protocolService.init($rootScope);
});
},{}]},{},[1]);
