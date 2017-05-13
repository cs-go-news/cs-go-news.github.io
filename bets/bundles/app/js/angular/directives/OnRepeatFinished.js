(function (app) {
    'use strict';

    app.directive('onRepeatFinished', ['$timeout', '$parse', function ($timeout, $parse) {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                if (true === scope.$last && attr.onRepeatFinished) {
                    $parse(attr.onRepeatFinished)(scope);
                }
            }
        }
    }]);
})(app);