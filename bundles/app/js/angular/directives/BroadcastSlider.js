(function (app) {
    'use strict';

    app.directive('broadcastSlider', ['$timeout', '$parse', function ($timeout, $parse) {
        return {
            restrict: 'E',
            templateUrl: '/bundles/app/js/angular/templates/broadcast.html',
            replace: true,
            scope: true
        }
    }]);
})(app);