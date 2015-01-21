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
        var el = $(this);
        $(window).on('scroll', function() {
            if ($(window).scrollTop() > offsetTop) {
                el.attr('style', 'position:fixed;top:'+offsetTop+';left:0px;width:' + width + 'px');
            } else {
                el.attr('style', '');
            }
        });  
    }
});
function setSectionHeights(){
    var height = window.innerHeight - $('nav').height();
    var padding = $('nav').height();
    $('section').css({
        'height':height,
        'paddingTop':padding
    });
    var mainHeight = height - $('header').height() - padding;
    $('section#main').css({
        'height':mainHeight
    })
}
function setWaypoints(){
    var waypoints = $('section').waypoint({
        handler: function(direction) {
            var section = this.element.id;
            $('nav a').removeClass('active');
            $('nav a[data-section='+section+']').addClass('active');
        },
        offset: 150
    });
    //SCROLL BOTTOM
    $(window).scroll(function() {
        if($(window).scrollTop() + window.innerHeight >= $('body').height() - 60) {
            $('nav a').removeClass('active');
            $('nav a:last').addClass('active');
        }
    });
}