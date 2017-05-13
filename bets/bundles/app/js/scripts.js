$(document).ready(function(e) {
    $('.allmatches-table .table tbody tr').on('click', function () {
        var title = $(this).attr('data-title');

        $('#popup-allmatches .popbox-header p span').text(title);
        $('#popup-allmatches').show();
    });

    $('.action-express-history tbody').on('click', 'tr', function (event) {
        var id = $(this).attr('data-express-id');

        $.get('/api/express_bet/' + id)
            .done(function (response) {
                $('.side_left').prepend(response);
            });
    });

    $('.action-cash-out-popup').on('click', 'a.action', function (event) {
        event.preventDefault();

        var id = $(this).attr('data-element');
        $(id).show();
    });

    $(document).on('mousedown', '.action-z-index-change', function() {
        $('.action-z-index-change').css('z-index', '200');
        $(this).css('z-index', '201');
    });
});