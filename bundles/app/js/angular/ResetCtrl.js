(function (app) {
    'use strict';

    app.controller('ResetCtrl', [
        '$scope', '$http',
        function ($scope, $http) {
            $scope.password = {
                resetToken: '',
                password: '',
                passwordConfirm: ''
            };

            $scope.submitPassword = function () {
                $http.post('/api/reset_password', $scope.password)
                    .then(function (response) {
                        $scope.password = {
                            resetToken: '',
                            password: '',
                            passwordConfirm: ''
                        };
                        $scope.showPopupMessage(response.data.data);
                    }, function (response) {
                        $scope.showPopupMessage(response.data.data);
                    });
            }
        }
    ]);
})(app);