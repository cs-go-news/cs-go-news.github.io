(function (app) {
    'use strict';

    app.controller('BroadcastCtrl', [
        '$scope', '$http', '$compile',
        function ($scope, $http, $compile) {
            $scope.broadcasts = {};
            $scope.isPlayerShow = false;
            $scope.chatPath = '/chat/0';

            var bSlider = false;
            var elementSlider = $('.broadcast_slider ul');
            var playerPlace = $('.twitch_player');
            var popupPlayerPlace = $('#popup-broadcasts');

            $scope.setIsPlayerShow = function (isShow) {
                var localStorageIsPlayerShow = $scope.getFormLocalStorageIsPlayerShow();
                if (localStorageIsPlayerShow == null) {
                    $scope.isPlayerShow = isShow;
                } else {
                    $scope.isPlayerShow = localStorageIsPlayerShow;
                }
            };

            $scope.setInLocalStorageIsPlayerShow = function (isShow) {
                window.localStorage.setItem('is_player_show', isShow);
            };

            $scope.getFormLocalStorageIsPlayerShow = function () {
                var value = window.localStorage.getItem('is_player_show');

                if (value == "true") {
                    return true;
                } else if (value == "false") {
                    return false;
                } else {
                    return null;
                }
            };

            $http.get('/api/broadcasts')
                .then(function (response) {
                    $scope.broadcasts = response.data;
                });

            setInterval(updateBroadcasts, 30000);

            function updateBroadcasts() {
                $http.get('/api/broadcasts')
                    .then(function (response) {
                        $scope.broadcasts = response.data;
                    });
            }

            $scope.loadPlayer = function (id, lang) {
                lang = lang ? '?lang=' + lang : '';
                $http.get('/api/broadcasts/' + id + lang)
                    .then(function (response) {
                        playerPlace.html(
                            $compile(response.data)($scope)
                        );
                        $scope.isPlayerShow = true;
                    });
            };

            $scope.loadPopupPlayer = function (id, lang) {
                var _lang = lang ? '?lang=' + lang : '';
                $http.get('/api/broadcasts/popup/' + id + _lang)
                    .then(function (response) {
                        popupPlayerPlace.append(
                            $compile(response.data)($scope)
                        );

                        $("#popup-broadcast-" + lang + "-" + id).draggable({
                            cursor: 'move'
                        });
                    });
            };

            $scope.changeChannel = function (channel) {
                $scope.chatPath = '/chat/' + channel;
            };

            $scope.initSlider = function () {
                if ($scope.broadcasts.length > 0) {
                    if (bSlider){
                        bSlider.reloadSlider();
                    } else {
                        bSlider = elementSlider.bxSlider({
                            minSlides: 1,
                            maxSlides: 5,
                            slideWidth: 193,
                            slideMargin: 25,
                            pager: false,
                            useCSS: false,
                            controls: true,
                            moveSlides: 2,
                            infiniteLoop: false,
                            hideControlOnEnd: true
                        });
                    }
                }
            };
        }
    ]);
})(app);