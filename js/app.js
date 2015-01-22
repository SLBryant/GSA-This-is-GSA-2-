$(function(){
	$('.sticky').sticky();
	setSectionHeights();
	setWaypoints();
	gsaHeader();
	navigation();
	$(window).resize(function(){
		setSectionHeights();
		updateNavPositionLeft();
	});

    // Carousel
    $('.carousel').carousel({
        interval : false
    });


    var carouselID = $('#our-priorities-carousel');
    var numberOfItems = carouselID.find('.item').length;
    var eqValue = parseInt(numberOfItems) - 1;
        carouselID.on('slid.bs.carousel', function () {
        var firstSlide = $(this).find('.item:eq(0)');
        var lastSlide = $(this).find('.item:eq('+eqValue+')');
        // check if it's the first slide
        if(firstSlide.hasClass('active')) {
            $(this).find('.left').css('display','none');
        } else {
            $(this).find('.left').css('display','block');
        }
        // check if it's the last slide
        if(lastSlide.hasClass('active')) {
            $(this).find('.right').css('display','none');
        } else {
            $(this).find('.right').css('display','block');
        }
    });

    // Modal
    $('#modalView').on('shown.bs.modal', function (event) {
        var button = $(event.relatedTarget);
        var file = button.attr('data-source');
           $('#content-catcher').load('modals/'+file+'.html', function() {
               $('#modal-loading').fadeOut(300);
           });
    });

    $('#modalView').on('hidden.bs.modal', function (event) {
        $('#content-catcher').empty();
        $('<img>').attr('id','modal-loading').attr('src','images/loading.gif').appendTo('#content-catcher');
    });



});

function navigation(){
	$('nav a').on('click',function(){
		var sectionName = $(this).attr('data-section');
		$('html, body').animate({
		    scrollTop: $('#'+sectionName).offset().top - 60
		}, 1000);
	});
}
function updateNavPositionLeft(){
	/*var offsetTop = $('nav').offset().top;
	if( $(window).scrollTop() + 100 > offsetTop ){
		var containerOffset = $('.main-container').offset().left;
		var containerWidth = $('.main-container').outerWidth()
		var navWidth = $('nav').width();
		var innerSpace = containerWidth - navWidth;
		var innerOffset = innerSpace / 2
		var newOffset = containerOffset + innerOffset;
		$('nav').css('left',newOffset)
	}*/
}