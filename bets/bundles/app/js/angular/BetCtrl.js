(function (app) {
    'use strict';

    app.controller('BetCtrl', [
        '$scope', '$http', '$compile',
        function ($scope, $http, $compile) {
            $scope.matches = [];
            $scope.mainMatch = {};
            $scope.match = {}; // активный матч в popup
            $scope.subMatch = [];
            $scope.time = '';
            $scope.gameCheckboxes = {};
            $scope.games = [];
            $scope.collapse = [];
            $scope.isPopupMatchShow = false;
            $scope.isPopupSubMatchShow = false;
            $scope.isPopupAskBetShow = false;
            $scope.realMoney = true;
            $scope.currencyName = 'RUB';
            $scope.prize = 0;
            var betModel = {
                match: null,
                type: 'real',
                amount: 0,
                coefficient: 0.000,
                betOn: 'first'
            };
            $scope.bet = angular.copy(betModel);
            $scope.formBet = { first: '', draw: '', second: '' };
            $scope.disableSendBetButton = true;

            var countdown = false;

            $http.get('/api/matches')
                .then(function (response) {
                    $scope.matches = response.data;
                });

            setInterval(update, 5000);

            function update() {

                $http.get('/api/matches')
                    .then(function (response) {
                        var matches = response.data;

                        angular.forEach($scope.matches, matchesSetter, matches);

                        /** удаляем матчи которых нет в response массиве */
                        angular.forEach($scope.matches, function (value, key) {
                            if (false === value.updated) {
                                this.splice(key, 1);
                            }
                        }, $scope.matches);

                        /** добавляем новые матчи, которые не были удалены из response массива */
                        for (var i = 0; i < matches.length; i++) {
                            $scope.matches.push(matches[i]);
                        }
                    });

                /** если открыт попап - обновляем и его */
                if ($scope.isPopupMatchShow) {
                    $http.get('/api/matches/' + $scope.mainMatch.id)
                        .then(function (response) {
                            $scope.mainMatch = response.data;
                            $scope.setMatch($scope.match.id);
                        });
                }
            }

            /** sub является ассоциативным массивом, нельзя использовать свойство length */
            $scope.getCountSubMatch = function (sub) {
                if (typeof sub !== 'object') {
                    return 0;
                }

                return Object.keys(sub).length;
            };

            $scope.setTime = function (time) {
                $scope.time = time;
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

            $scope.filterByTime = function (element) {
                switch ($scope.time) {
                    case 'future':
                        if (!element.cancelled && !element.completed && !element.started) {
                            return element;
                        }
                        break;
                    case 'active':
                        if (element.started) {
                            return element;
                        }
                        break;
                    case 'last':
                        if (element.cancelled || element.completed) {
                            return element;
                        }
                        break;
                    default:
                        return element;

                }
            };

            $scope.conf = function (value) {
                value = value * 1;
                return value.toFixed(3);
            };

            $scope.setMoneyType = function (type) {
                if ('real' == type) {
                    $scope.realMoney = true;
                    $scope.currencyName = 'RUB';
                } else {
                    $scope.realMoney = false;
                    $scope.currencyName = 'ECB';
                }
            };

            $scope.popupMatchShow = function (id, subId) {
                subId = subId || id;

                $http.get('/api/matches/' + id)
                    .then(function (response) {
                        $scope.mainMatch = response.data;
                        $scope.setMatch(subId);
                        timer($scope.match);

                        $scope.isPopupMatchShow = true;
                    });
            };

            $scope.setMatch = function (id) {
                if ($scope.mainMatch.id == id){
                    $scope.match = $scope.mainMatch;
                    return;
                }

                angular.forEach($scope.mainMatch.subMatch, function(value) {
                    if (value.id == id) {
                        $scope.match = value;
                    }
                })
            };

            /** срабатывает при изменнении суммы ставки */
            $scope.changeBet = function (betOn, modelValue, step) {
                step = parseInt(step) || 0;
                modelValue = parseInt(modelValue) || 0;

                var value = modelValue + step;
                var coefficient = 0.000;

                $scope.setToZeroFormBet();

                if (value <= 0) {
                    $scope.bet = angular.copy(betModel);

                    return;
                }

                switch (betOn) {
                    case 'draw':
                        $scope.formBet.draw = value;
                        coefficient = $scope.match.coefficient.coefficientDraw;
                        break;
                    case 'second':
                        $scope.formBet.second = value;
                        coefficient = $scope.match.coefficient.coefficientTwo;
                        break;
                    default:
                        $scope.formBet.first = value;
                        coefficient = $scope.match.coefficient.coefficientOne;
                }

                $scope.bet = {
                    match: $scope.match.id,
                    type: $scope.realMoney ? 'real' : 'virtual',
                    amount: value,
                    coefficient: coefficient,
                    betOn: betOn
                };

                calculatePrize();

                $scope.disableSendBetButton = false;
            };

            $scope.sendBet = function () {
                $scope.disableSendBetButton = true;

                $http.post('/api/bets', $scope.bet)
                    .then(function (response) {
                        $scope.updateUser();

                        $scope.setToZeroFormBet();
                        $scope.isPopupAskBetShow = false;
                        $scope.isPopupMatchShow = false;
                        $scope.match = {};
                        $scope.showPopupMessage(response.data.data);
                    }, function (response) {
                        $scope.isPopupAskBetShow = false;
                        if ('error-confirmUrl' == response.data.status) {
                            $scope.showPopupMessageConfirmUrl(response.data.data);
                        } else {
                            $scope.showPopupMessage(response.data.data);
                        }

                        $scope.disableSendBetButton = false;
                    });

                update();
            };

            function calculatePrize() {
                var prize = $scope.bet.amount * $scope.bet.coefficient;
                $scope.prize = prize.toFixed(2);
            }

            /** Остальные поля нужно обнулить */
            $scope.setToZeroFormBet = function() {
                $scope.formBet = { first: '', draw: '', second: '' };
                $scope.prize = 0;
                $scope.bet = angular.copy(betModel);
                $scope.disableSendBetButton = true;
            };

            function timer(match) {
                $('.popup-time').remove();
                $('#popup-center').prepend('<p class="mh-date popup-time"></p>');


                if (match.completed) {
                    if (match.pointOne == match.pointTwo) {
                        $('.popup-time').text('НИЧЬЯ');
                    } else {
                        $('.popup-time').text('ЗАВЕРШЕН');
                    }
                    return;
                }

                if (match.cancelled) {
                    $('.popup-time').text('ОТМЕНЕН');
                    return;
                }

                if (match.started) {
                    $('.popup-time').text('НАЧАЛСЯ');
                    return;
                }

                if (match.acceptBets) {
                    $('.popup-time').text('НАЧАЛСЯ');
                    return;
                }

                countdown = $('.popup-time').countdown({
                    date: match.startTime,
                    render: function (data) {
                        $(this.el).html(
                            this.leadingZeros(data.days * 24 + data.hours, 2)
                            + ":" + this.leadingZeros(data.min, 2)
                            + ":" + this.leadingZeros(data.sec, 2));
                    }
                });
            }

            $scope.getFlagIconByBetOn = function(match, betOn) {
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
        }
    ]);
})(app);