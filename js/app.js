$(function(){
	$('.sticky').sticky();
	setSectionHeights();
	setWaypoints();
	gsaHeader();
	navigation();
});

function navigation(){
	$('nav a').on('click',function(){
		var sectionName = $(this).attr('data-section');
		$('html, body').animate({
		    scrollTop: $('#'+sectionName).offset().top - 60
		}, 1000);
	});
}