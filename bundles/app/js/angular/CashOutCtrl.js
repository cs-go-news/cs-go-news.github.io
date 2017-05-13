(function (app) {
    'use strict';

    app.controller('CashOutCtrl', [
        '$scope', '$http',
        function ($scope, $http) {
            $scope.systems = [];
            $scope.system = {};
            $scope.cashout = {
                paymentPurse: '',
                cashOut: ''
            };
            $scope.cashoutModel = {
                paymentPurse: '',
                cashOut: ''
            };
            $scope.isPopupCashOutShow = false;

            $http.get('/api/cashout/systems')
                .then(function (response) {
                    $scope.systems = response.data;
                });

            $scope.showCashOutPopup = function (system) {
                $scope.system = system;
                $scope.isPopupCashOutShow = true;
            };

            $scope.closeCashOutPopup = function () {
                $scope.isPopupCashOutShow = false;
                $scope.system = {};
                $scope.cashout = angular.copy($scope.cashoutModel);
            };

            $scope.submitCashOut = function (systemId) {
                $http.post('/api/cashout/' + systemId, $scope.cashout)
                    .then(function (response) {
                        $scope.updateUser();

                        $scope.closeCashOutPopup();
                        $scope.showPopupMessage(response.data.data);
                    }, function (response) {
                        $scope.showPopupMessage(response.data.data);
                    });
            };

            $scope.change = function () {
                $scope.cashout.cashOut = $scope.cashout.cashOut.replace(/\D/g, '');
            };
        }
    ]);
})(app);