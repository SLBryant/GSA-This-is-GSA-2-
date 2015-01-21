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
	var containerOffset = $('.main-container').offset().left;
	var containerWidth = $('.main-container').outerWidth()
	var navWidth = $('nav').width();
	var innerSpace = containerWidth - navWidth;
	var innerOffset = innerSpace / 2
	var newOffset = containerOffset + innerOffset;
	$('nav').css('left',newOffset)
}