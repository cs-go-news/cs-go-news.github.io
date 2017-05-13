(function (app) {
    'use strict';

    app.controller('MessageCtrl', [
        '$scope', '$http',
        function ($scope, $http) {
            $scope.message = {};
            $scope.isMessageShow = false;

            $scope.showMessage = function (id) {
                $http.get('/api/messages/' + id)
                    .then(function (response) {
                        $scope.message = response.data;
                        $scope.isMessageShow = true;
                        $scope.updateUser();
                    }, function (response) {
                        $scope.showPopupMessage(response.data.data);
                    });
            }
        }
    ]);
})(app);