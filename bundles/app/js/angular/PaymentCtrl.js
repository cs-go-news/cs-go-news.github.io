(function (app) {
    'use strict';

    app.controller('PaymentCtrl', [
        '$scope', '$http',
        function ($scope, $http) {
            $scope.systems = [];
            $scope.system = {};
            $scope.input = '';
            $scope.amount = '';
            $scope.currencyId = '';

            $scope.isPopupPaymentInputShow = false;
            $scope.isPopupPaymentShow = false;

            $http.get('/api/payment/systems')
                .then(function (response) {
                    $scope.systems = response.data;
                });

            $scope.showInputPopup = function (system) {
                $scope.system = system;
                $scope.currencyId = system.currencyId;
                $scope.isPopupPaymentInputShow = true;
            };

            $scope.closeInputPopup = function () {
                $scope.isPopupPaymentInputShow = false;
                $scope.system = {};
                $scope.input = '';
                $scope.amount = '';
                $scope.currencyId = '';
            };

            $scope.closePaymentPopup = function () {
                $scope.isPopupPaymentShow = false;
                $scope.isPopupPaymentInputShow = true;
            };

            $scope.next = function () {
                if ('' === $scope.input) {
                    return false;
                }

                var amount = $scope.input * 1;
                $scope.amount = amount.toFixed(2);

                $scope.isPopupPaymentInputShow = false;
                $scope.isPopupPaymentShow = true;
                angular.element('#submitPayment').focus();
            };

            $scope.send = function (url) {
                window.location = url + '?amount=' + $scope.amount + '&currencyId=' + $scope.currencyId;
            };

            $scope.change = function () {
                $scope.input = $scope.input.replace(/\D/g, '');
            };
        }
    ]);
})(app);