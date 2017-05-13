(function (app) {
    'use strict';

    app.controller('AppCtrl', [
        '$scope', '$http', '$rootScope',
        function ($scope, $http, $rootScope) {
            $scope.user = [];
            $scope.unread = 0;
            $scope.isPopupLoginShow = false;
            $scope.isPopupRegistrationShow = false;
            $scope.isPopupResetShow = false;
            $scope.login = '';
            $scope.password = '';

            $scope.loginData = {};
            $scope.registrationData = {
                login: '',
                firstName: '',
                lastName: '',
                birthday: { day: '', month: '', year: '' },
                country: '',
                email: '',
                password: '',
                passwordConfirm: '',
                agree: 0,
                confirmOld: 0
            };

            $scope.popup = {};
            $scope.isPopupMessageShow = false;
            $scope.isPopupMessageConfirmUrlShow = false;

            $scope.isPopupAlertMessageShow = false;

            $scope.minChange = 0;
            $scope.isPopupChangePoint = false;

            $scope.isConfirmLinkShow = true;

            $scope.updateUser = function () {
                $http.get('/api/user')
                    .then(function (response) {
                        if (!$.isEmptyObject(response.data)) {
                            $scope.user = response.data.user;
                            $scope.unread = response.data.unread;
                            $scope.isPopupAlertMessageShow = response.data.alert;
                        }
                    });
            };
            $scope.updateUser();
            setInterval($scope.updateUser, 30000);

            $scope.submitLoginForm = function () {
                $http.post('/api/login', { login: $scope.login, password: $scope.password })
                    .then(function (response) {
                        $scope.isPopupLoginShow = false;
                        window.location.reload();
                    }, function (response) {
                        $scope.popup = response.data.data;
                        $scope.isPopupMessageShow = true;
                    });
            };

            $scope.submitResetEmail = function () {
                $http.post('/api/reset_send', $scope.reset)
                    .then(function (response) {
                        $scope.isPopupResetShow = false;
                        $scope.showPopupMessage(response.data.data);
                    }, function (response) {
                        $scope.showPopupMessage(response.data.data);
                    });
            };

            $scope.sendConfirmTokenEmail = function () {
                $http.post('/api/confirm_token_send', {})
                    .then(function (response) {
                        $scope.isConfirmLinkShow = false;
                        $scope.showPopupMessage(response.data.data);
                    }, function (response) {
                        $scope.showPopupMessage(response.data.data);
                    });
            };

            $scope.submitRegistrationForm = function() {
                $http.post('/api/registration', $scope.registrationData)
                    .then(function (response) {
                        $scope.isPopupRegistrationShow = false;
                        $scope.popup = response.data.data;
                        $scope.isPopupMessageShow = true;
                    }, function (response) {
                        $scope.popup = response.data.data;
                        $scope.isPopupMessageShow = true;
                    });
            };

            $scope.showChangePointPopup = function () {
                $http.get('/api/change_min_point')
                    .then(function (response) {
                        $scope.minChange = response.data;
                        $scope.isPopupChangePoint = true;
                    }, function (response) {
                        $scope.isPopupChangePoint = false;
                        $scope.showPopupMessage(response.data.data);
                    });
            };

            $scope.submitChangePoint = function () {
                $http.post('/api/change_point', {})
                    .then(function (response) {
                        $scope.isPopupChangePoint = false;
                        $scope.showPopupMessage(response.data.data);
                        $scope.updateUser();
                    }, function (response) {
                        $scope.isPopupChangePoint = false;
                        $scope.showPopupMessage(response.data.data);
                    });
            };

            $scope.showPopupLogin = function () {
                $scope.isPopupLoginShow = true;
            };

            $scope.showPopupRegistration = function () {
                $scope.isPopupRegistrationShow = true;
            };

            $scope.showPopupMessage = function (data) {
                $scope.popup = data;
                $scope.isPopupMessageShow = true;
            };

            $scope.showPopupMessageConfirmUrl = function (data) {
                $scope.popup = data;
                $scope.isPopupMessageConfirmUrlShow = true;
            };

            function listenerIFrame(event) {
                switch (event.data) {
                    case 'singup':
                        $scope.$apply(function () {
                            $scope.isPopupRegistrationShow = true;
                        });
                        break;
                    case 'singin':
                        $scope.$apply(function () {
                            $scope.isPopupLoginShow = true;
                        });
                        break;
                }
            }

            if (window.addEventListener) {
                window.addEventListener("message", listenerIFrame, false);
            } else {
                // IE8
                window.attachEvent("onmessage", listenerIFrame);
            }
        }
    ]);
})(app);