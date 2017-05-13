$(document).ready(function(e) {
	$('.h_lang_chose').click(function(e) {
		$(this).closest('.h_lang').find('.lang_dropdown').show();
		return false;
	});
	$('.h_lang').hover(function(e) {
	},function(e) {
		$(this).find('.lang_dropdown').hide();
	});

	$('#sign_in').on('click', function(){
		$('#popup-login').show();
	});	

	$('#registration').on('click', function(){
		$('#popup-signUp').show();
	});	
	
	$('#sign-passworld').on('click', function(){
		$('#popup-passworld').show();
	});		
	
	$('.psaction-ajaxload-popup-player').on('click', function(){
		$('#popup-broadcast').show();
		return false;
	});
	
	$('.matches_table .betstable-p').on('click', function(){
		$('#popup-matches').show();
	});	

	$('.matches_table .betstable-tr.null.null1 td:nth-child(-n+7)').on('click', function(){
		$('#popup-matches').show();
	});
	
	$('.matches_table .betstable-tr.null.null-error td:nth-child(-n+7)').on('click', function(){
		$('#popup-matches2-error').show();
	});	
	
	$('.matches_table .betstable-tr.null.null-error2 td:nth-child(-n+7)').on('click', function(){
		$('#popup-matches2-error2').show();
	});
	
	$('.matches_table .betstable-tr.null.null-error3 td:nth-child(-n+7)').on('click', function(){
		$('#popup-matches2-error3').show();
	});
	
	$('.matches_table .betstable-tr.null2 td:nth-child(-n+7)').on('click', function(){
		$('#popup-matches2').show();
	});	
	
	$('.matches_table .betstable-tr.match-now td:nth-child(-n+7)').on('click', function(){
		$('#popup-matches3').show();
	});			

	$('.matches_table .betstable-tr.match-past td:nth-child(-n+7)').on('click', function(){
		$('#popup-matches4').show();
	});	

	$('.matches_table .betstable-tr.match-none td:nth-child(-n+7)').on('click', function(){
		$('#popup-matches5').show();
	});	

	$('.matches_table .betstable-tr.match-half td:nth-child(-n+7)').on('click', function(){
		$('#popup-matches6').show();
	});
	
	$('.table-user-message a').on('click', function(){
		$('#popup-user-allmessage').show();
	});	
	
	$('body').on('click', function(){
		$('#popup-info-message').show();
	});	
	
	$('#popup-a-express').on('click', function(){
		$('#popup-popstavka').show();
	});		


	$('.allexpress-table .table tbody tr').on('click', function(){
		$('#popup-allexpress').show();
	});



	$('.refill-list a').on('click', function(){
		$('#popup-balans').show();
	});	

	$('#popup-balanspay').on('click', function(){
		$('#popup-balans2').show();
	});	
	
	$('#popup-aecb').on('click', function(){
		$('#popup-ecb').show();
	});		

	$('#popup-a-passworld').on('click', function(){
		$('#popup-passworld').show();
	});		
	
	$('#popup-a-saveprofile').on('click', function(){
		$('#popup-saveprofile').show();
	});	
	
	$('#popup-a-popstavka-ok').on('click', function(){
		$('#popup-popstavka-ok').show();
	});
	
	$('#popup-a-popstavka-ok2').on('click', function(){
		$('#popup-popstavka-ok2').show();
	});			
	
	$('#popup-a-popstavka').on('click', function(){
		$('#popup-popstavka').show();
	});	
	
	$('#popup-a-popstavka2').on('click', function(){
		$('#popup-popstavka2').show();
	});		

	$('#popup-a-stavka-bal').on('click', function(){
		$('#popup-stavka-bal').show();
	});

	$('#popup-a-stavka-ecb').on('click', function(){
		$('#popup-popstavka-ecb').show();
	});	



  	$('.close').on('click',function(){
    	$('.popup').hide();
	});
	
	$('.switcher').on("click", function(){
		$('.mc_settings').toggleClass('action-expand');
		$('.switcher p').toggleClass('switcher-p-border');
	});	
	
	$('.btable-tr .btable-check').on("click", function(){
		$('.btable-tr').toggleClass('action-expand');
		$('.btable-table').toggleClass('btable-tr-active');
	});	
	
	$('.tabs ul li').on('click',function(){
		$('.tabs ul li').removeClass('active');
		$(this).addClass('active');
	});	

    $(document).on('click', '.psaction-videoChat-expand-minimize', function(e) {
        e.preventDefault();
        $('#wrapper').toggleClass('action-expand');
    });	

});

$(document).on('click', '.psaction-broadcast-change-lang', function(e) {
	e.preventDefault();
	$('#wrapper').toggleClass('action-change-lang');
});

$(document).on('click', '.psaction-chat-change-site-game', function(e) {
	e.preventDefault();
	$('.ne-buttons').toggleClass('action-change-chat');
});

$(document).ready(init);

function init(){
  $("#popup-broadcast").draggable({
   cursor: 'move'
  });
}
