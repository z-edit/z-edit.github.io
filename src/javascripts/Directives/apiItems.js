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
            module: '@',
            items: '=?',
            depth: '=?'
        }
    }
});

ngapp.controller('apiItemsController', function(resourceService) {
    var ctrl = this;
    ctrl.tintBg = (ctrl.depth || 0) % 2 === 0;

    var getBasePath = function() {
        if (ctrl.basePath) return ctrl.basePath.slice(4);
        if (ctrl.module) return 'modules/' + ctrl.module + '/docs';
        return 'docs/development/apis';
    };

    var buildItems = function(items) {
        if (!items) return;
        ctrl.items = items.map(function(item) {
            if (!item.type) item.type = 'function';
            item.isEvent = item.type === 'event';
            item.isOptions = item.type === 'options';
            return item;
        });
    };

    if (ctrl.path) {
        var basePath = getBasePath(),
            path = basePath + '/' + ctrl.path;
        resourceService.get(path).then(buildItems);
    } else {
        buildItems(ctrl.items);
    }
});
