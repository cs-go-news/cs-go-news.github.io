(function (app) {
    'use strict';

    app.controller('ProfileSideBarCtrl', [
        '$scope', '$http', '$compile',
        function ($scope, $http, $compile) {
            $scope.isPopupPasswordShow = false;
            $scope.password = {
                oldPassword: '',
                password: '',
                passwordConfirm: ''
            };

            $scope.submitPassword = function () {
                $http.post('/api/change_password', $scope.password)
                    .then(function (response) {
                        $scope.isPopupPasswordShow = false;
                        $scope.showPopupMessage(response.data.data);
                    }, function (response) {
                        $scope.showPopupMessage(response.data.data);
                    });
            }
        }
    ]);
})(app);