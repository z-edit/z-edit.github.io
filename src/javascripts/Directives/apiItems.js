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
