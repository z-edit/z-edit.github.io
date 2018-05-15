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
