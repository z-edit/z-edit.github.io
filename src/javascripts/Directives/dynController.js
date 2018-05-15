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
