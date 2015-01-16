//STICKY NAV THAT DOESN'T SUCK
$.fn.extend({
    sticky: function(){
        var offsetTop = $(this).offset().top;
        var offsetLeft = $(this).offset().left;
        var width = $(this).width();
        var position = $(window).scrollTop();
        var el = $(this)
        $(window).on('scroll', function() {
            if ($(window).scrollTop() > offsetTop) {
                el.attr('style', 'position:fixed;top:0px;left:'+offsetLeft+'px;width:'+width+'px'); /*width:100%*/
            } else {
                el.attr('style', '');
            }
        });
    },
    stickyFixed: function(){
        var offsetTop = $(this).css('top');
        var width = $(this).width();
        var position = $(window).scrollTop();
        var el = $(this)
        $(window).on('scroll', function() {
            if ($(window).scrollTop() > offsetTop) {
                el.attr('style', 'position:fixed;top:'+offsetTop+';left:0px;width:' + width + 'px');
            } else {
                el.attr('style', '');
            }
        });  
    }
});