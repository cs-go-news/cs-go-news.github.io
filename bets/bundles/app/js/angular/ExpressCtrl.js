(function (app) {
    'use strict';

    app.controller('ExpressCtrl', [
        '$scope', '$http',
        function ($scope, $http) {
            $scope.matches = [];
            $scope.collapse = [];
            $scope.games = [];

            $scope.couponMatches = [];
            $scope.coupons = {};
            $scope.amount = '';
            $scope.coefficient = '0.000';
            $scope.prize = '0.00';

            $scope.isPopupAskBetShow = false;
            $scope.disableSendBetButton = true;
            var betModel = {
                coupon: {},
                amount: 0
            };
            $scope.bet = angular.copy(betModel);

            $scope.expressBetCommission = 0;

            $http.get('/api/express')
                .then(function (response) {
                    $scope.matches = response.data;
                });

            $scope.sendBet = function () {
                $scope.isPopupAskBetShow = false;
                $http.post('/api/express_bet', $scope.bet)
                    .then(function (response) {
                        $scope.coupons = {};
                        $scope.bet = angular.copy(betModel);
                        $scope.updateCoupon();
                        $scope.updateUser();
                        $scope.showPopupMessage(response.data.data);
                    }, function (response) {
                        $scope.showPopupMessage(response.data.data);
                    });
            };

            function update() {
                $http.get('/api/express')
                    .then(function (response) {
                        var matches = response.data;

                        angular.forEach($scope.matches, matchesSetter, matches);

                        /** удаляем матчи которых нет в response массиве */
                        angular.forEach($scope.matches, function (value, key) {
                            if (false === value.updated) {
                                $scope.removeCoupon(value);
                                this.splice(key, 1);
                            }
                        }, $scope.matches);

                        /** добавляем новые матчи, которые не были удалены из response массива */
                        for (var i = 0; i < matches.length; i++) {
                            $scope.matches.push(matches[i]);
                        }
                    });

                $scope.calculatePrize();
            }

            setInterval(update, 10000);

            /** sub является ассоциативным массивом, нельзя использовать свойство length */
            $scope.getCountSubMatch = function (sub) {
                return Object.keys(sub).length;
            };

            $scope.selectGameId = function(id) {
                var i = $.inArray(id, $scope.games);

                if (i > -1) {
                    $scope.games.splice(i, 1);
                } else {
                    $scope.games.push(id);
                }
            };

            $scope.filterByGameId = function(element) {
                if ($scope.games.length > 0) {
                    if ($.inArray(element.game.id, $scope.games) < 0) {
                        return;
                    }
                }
                return element;
            };

            /** Coupons */
            $scope.setCoupon = function (match, betOn, coefficient) {
                if (!coefficient) {
                    return;
                }

                var threadId = getThreadId(match);

                if (threadId in $scope.coupons &&
                    $scope.coupons[threadId].matchId == match.id &&
                    $scope.coupons[threadId].betOn == betOn) {
                    delete $scope.coupons[threadId];
                } else {
                    $scope.coupons[threadId] = {matchId: match.id, betOn: betOn};
                }

                $scope.updateCoupon();
            };

            $scope.removeCoupon = function (match) {
                var threadId = getThreadId(match);

                if (threadId in $scope.coupons) {
                    delete $scope.coupons[threadId];
                }

                $scope.updateCoupon();
            };

            $scope.updateCoupon = function () {
                var ids = Object.keys($scope.coupons);
                var matches = [];
                var id = '';

                angular.forEach($scope.matches, function (value) {
                    id = value.id.toString();

                    if ($.inArray(id, ids) >= 0) {
                        if (id == $scope.coupons[id].matchId) {
                            matches.push(value);
                        } else {
                            angular.forEach(value.subMatch, function (sub) {
                                if (sub.id == $scope.coupons[id].matchId) {
                                    matches.push(sub);
                                }
                            }, matches);
                        }
                    }
                }, matches);

                $scope.couponMatches = matches;
                $scope.calculatePrize();
            };

            $scope.changeBet = function (step) {
                step = parseInt(step) || 0;
                var modelValue = parseInt($scope.bet.amount) || 0;

                var value = modelValue + step;

                if (value <= 0) {
                    $scope.bet = angular.copy(betModel);
                    $scope.calculatePrize();

                    return null;
                }

                $scope.bet = {
                    coupon: $scope.coupons,
                    amount: value
                };

                $scope.calculatePrize();

                return null;
            };

            $scope.calculatePrize = function () {
                var coefficient = 1;

                angular.forEach($scope.couponMatches, function (value) {
                    coefficient *= $scope.getCoefficientByBetOn(value) * 1;
                });

                $scope.coefficient = coefficient.toFixed(3);
                var prize = $scope.coefficient * $scope.bet.amount;

                if ($scope.expressBetCommission) {
                    prize -= $scope.expressBetCommission / 100 * prize;
                }

                $scope.prize = prize.toFixed(2);

                $scope.$broadcast('onCalculatedPrize');
            };

            $scope.$on('onCalculatedPrize', function () {
                $scope.disableSendBetButton = !($scope.couponMatches.length > 1 && $scope.bet.amount > 0);

                if ($scope.couponMatches.length == 0) {
                    $scope.coefficient = '0.000';
                    $scope.prize = '0.00';
                }
            });

            $scope.isActiveCoefficient = function(match, betOn) {
                var threadId = getThreadId(match);

                if (threadId in $scope.coupons) {
                    if (match.id == $scope.coupons[threadId].matchId && betOn == $scope.coupons[threadId].betOn) {
                        return true;
                    }
                }

                return false;
            };

            $scope.isNotCoefficient = function(match, betOn) {
                var coefficient = false;
                switch (betOn) {
                    case 'first':
                        coefficient = match.coefficient.coefficientOne;
                        break;
                    case 'second':
                        coefficient = match.coefficient.coefficientTwo;
                        break;
                    default:
                        coefficient = match.coefficient.coefficientDraw;
                }

                return !coefficient;
            };

            $scope.getFlagIconByBetOn = function(match) {
                var betOn = getBetOn(match);

                switch (betOn) {
                    case 'first':
                        return match.flagIconOnePath;
                        break;
                    case 'second':
                        return match.flagIconTwoPath;
                        break;
                    default:
                        return match.game.iconPath;
                }
            };

            $scope.getNicknameByBetOn = function(match) {
                var betOn = getBetOn(match);

                switch (betOn) {
                    case 'first':
                        return match.nickNameOne;
                        break;
                    case 'second':
                        return match.nickNameTwo;
                        break;
                    default:
                        return 'Ничья';
                }
            };

            $scope.getCoefficientByBetOn = function(match) {
                var betOn = getBetOn(match);

                switch (betOn) {
                    case 'first':
                        return match.coefficient.coefficientOne;
                        break;
                    case 'second':
                        return match.coefficient.coefficientTwo;
                        break;
                    default:
                        return match.coefficient.coefficientDraw;
                }
            };

            function getBetOn (match) {
                var threadId = getThreadId(match);
                if (threadId in $scope.coupons) {
                    return $scope.coupons[threadId].betOn;
                }

                return '';
            }

            function getThreadId(match) {
                return match.parent == 0 ? match.id : match.parent;
            }
        }
    ]);
})(app);