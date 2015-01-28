if(!GSA){
    var GSA = {}
}

GSA.images = new function(){

    this.cacheImages = function() {
        $.fn.preload = function() {
            this.each(function(){
                $('<img/>')[0].src = this;
            });
        }

        $(['images/intro-bg.jpg',
            'images/intro-bg-2.jpg',
            'images/intro-bg-3.jpg'
        ]).preload();
    }

    this.introBackgroundRotator = function() {
        var images = ['images/intro-bg.jpg', 'images/intro-bg-2.jpg', 'images/intro-bg-3.jpg'];
        $('#intro').css({'background-image': 'url('+images[Math.floor(Math.random() * images.length)] + ')'});

    }

};



GSA.navigation = new function() {
    var lastId,
        topMenu = $('#navigation'),
        topMenuHeight = topMenu.outerHeight(),
        distance = topMenu.offset().top,
        $window = $(window),
        menuItems = topMenu.find('a'),
        scrollItems = menuItems.map(function(){
            var item = $($(this).attr('href'));
            if (item.length) { return item; }
        });

    this.highlightCurrentNavItem = function () {
        $window.scroll(function() {
            var fromTop = $(this).scrollTop()+topMenuHeight;
            var cur = scrollItems.map(function(){
                if ($(this).offset().top < fromTop)
                    return this;
            });

            cur = cur[cur.length-1];
            var id = cur && cur.length ? cur[0].id : "";

            if (lastId !== id) {
                lastId = id;
                menuItems
                    .parent().removeClass("active")
                    .end().filter("[href=#"+id+"]").parent().addClass("active");
            }

            if(menuItems.parent('li').hasClass('active')) {
                $('#logo').addClass('active');
            } else {
                $('#logo').removeClass('active')
            }
        });
    };

    this.scrollToSection = function() {
        menuItems.click(function(e){
            var href = $(this).attr('href'),
                offsetTop = href === "#" ? 0 : $(href).offset().top-topMenuHeight+1;
            $('html, body').stop().animate({
                scrollTop: offsetTop
            }, 1000);
            e.preventDefault();
        });
    }

    this.stickyNav = function() {
        $window.scroll(function() {
            if ( $window.scrollTop() >= distance ) {
                topMenu.addClass('locked');
                $('.main-container').css('margin-top','50px');
            } else {
                topMenu.removeClass('locked');
                $('.main-container').css('margin-top','0');
            }
        });
    }
};

GSA.modals_carousels = new function() {
    var modalTemplate = $('#modalView');

    this.modals = function () {
        modalTemplate.on('shown.bs.modal', function (event) {
            var button = $(event.relatedTarget);
            var CID = button.attr('data-source');
            $('#content-catcher').load('http://gsa.gov/portal/content/' + CID + ' #content', function () {
                $('#modal-loading').fadeOut(300);
            });
        });

        modalTemplate.on('hidden.bs.modal', function (event) {
            $('#content-catcher').empty();
            $('<img>').attr('id', 'modal-loading').attr('src', 'images/loading.gif').appendTo('#content-catcher');
        });
    };

    this.carousels = function(carouselID) {
        $('.carousel').carousel({
            interval : false
        });

        var numberOfItems = $(carouselID).find('.item').length;
        var eqValue = parseInt(numberOfItems) - 1;
        $(carouselID).on('slid.bs.carousel', function () {
            var firstSlide = $(this).find('.item:eq(0)');
            var lastSlide = $(this).find('.item:eq('+eqValue+')');
            // check if it's the first slide
            if(firstSlide.hasClass('active')) {
                $(this).find('.left').css('display','none');
                $('.carousel-indicators').css('display','none');
            } else {
                $(this).find('.left').css('display','block');
                $('.carousel-indicators').css('display','block');
            }
            // check if it's the last slide
            if(lastSlide.hasClass('active')) {
                $(this).find('.right').css('display','none');
            } else {
                $(this).find('.right').css('display','block');
            }
        });

    }

    this.slideItemHeight = function(carouselID) {
        setTimeout(function() {
            var maxHeight = 0;
            $(carouselID).find('.item').each(function(){
                maxHeight = $(this).height() > maxHeight ? $(this).height() : maxHeight;
            });
            $(carouselID).find('.item').height(maxHeight);
        },1)
    }
};


/* /////////////////////////
    DOCUMENT READY        ///
/////////////////////////*/

$(function(){
    GSA.images.cacheImages();
    GSA.images.introBackgroundRotator();
    $('#logo a').click(function() {
        GSA.images.introBackgroundRotator();
    })

    GSA.navigation.stickyNav();
    GSA.navigation.scrollToSection();
    GSA.navigation.highlightCurrentNavItem();

    GSA.modals_carousels.modals();
    GSA.modals_carousels.carousels('#priorities-carousel');
    GSA.modals_carousels.slideItemHeight('#priorities-carousel');
    GSA.modals_carousels.carousels('#data-carousel');
    GSA.modals_carousels.slideItemHeight('#data-carousel');

});