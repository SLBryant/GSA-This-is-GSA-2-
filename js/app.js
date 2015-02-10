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
    var controller = $.superscrollorama({
        triggerAtCenter: false,
        playoutAnimations: true
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

    this.scrollorama = function() {
        var tweeningElement = '#intro';
        var heightOfTweeningElement = $(tweeningElement).innerHeight();
        controller.addTween(
            tweeningElement,
            (new TimelineLite())
                .append([
                    TweenMax.fromTo($('#thisIs-small, #GSA-small'),1,
                        {css: {opacity:0}, immediateRender: true},
                        {css: {opacity : 1}})
                ]),
            heightOfTweeningElement);
    }
};

GSA.modals_carousels = new function() {
    var modalTemplate = $('#modalView');
    var button = '';
    modalTemplate.modal({ show: false});

    this.modals = function () {
        modalTemplate.modal({ show: false}); // on load modal is not initiated

        $('.foursquare article').click(function() { // initiate modal on click
            $('.modal-content').css('max-height', $(window).height() - 100); // set max height to screen minus 100
            modalTemplate.modal('show');
            button = $(this);
        });


        modalTemplate.on('shown.bs.modal', function (event) {
            var CID = button.attr('id');
            var img = button.find('figure').find('img').attr('src');
            var title = button.find('h3').text();
            var intro = button.find('p').html();
            var location = window.location.protocol + "//" + window.location.host + "/";
            if(img != undefined) {
                $('#header-catcher').html('<article class="col-sm-12">' +
                '<figure class="col-sm-3">' +
                '<img src="' + img + '" alt="' + title + '">' +
                '</figure>' +
                '<div class="col-sm-9">' +
                '<h2>' + title + '</h2>' +
                '<h4>' + intro + '</h4>' +
                '</div>' +
                '</article>');
            } else {
                $('#header-catcher').html('<article class="col-sm-12">' +
                '<div>' +
                '<h2>' + title + '</h2>' +
                '</div>' +
                '</article>');
            };
            $('#content-catcher').load(location + 'portal/content/' + CID + ' #content', function () {
                $('#modal-loading').fadeOut(300);
            });

        });

        modalTemplate.on('hidden.bs.modal', function (event) {
            $('#content-catcher').empty();
            $('#header-catcher').empty();
            $('<img>').attr('id', 'modal-loading').attr('src', 'images/loading.gif').appendTo('#content-catcher');
        });
    };

    this.modalPrint = function() {
        $('.print').click(function(){
                $( ".modal-content" ).print();

                return( false );
        });
    };

    this.carousels = function(carouselID) {
        $(carouselID).carousel({
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
                $(this).find('.icon-navigation').slideUp(400);
            } else {
                $(this).find('.left').css('display','block');
                $(this).find('.icon-navigation').slideDown(400);
            }
            // check if it's the last slide
            if(lastSlide.hasClass('active')) {
                $(this).find('.right').css('display','none');
            } else {
                $(this).find('.right').css('display','block');
            }
        });

    };

    this.slideFunction = function(carouselID) {
        $(carouselID).on('slide.bs.carousel', function (event) {
            var button = $(event.relatedTarget);
            var slideNum = button.index();
            $(carouselID).find('.icon-navigation').find('figure').removeClass('active-icon');
            $(carouselID).find('.icon-navigation').find('figure').eq(slideNum).addClass('active-icon');
        });

    };

    this.slideItemHeight = function(carouselID) {
        setTimeout(function() {
            var maxHeight = 0;
            $(carouselID).find('.item').each(function(){
                maxHeight = $(this).height() > maxHeight ? $(this).height() : maxHeight;
            });
            $(carouselID).find('.item').height(maxHeight);
        },1)
    }

    this.goToSlide = function(carouselID,buttonEQ) {
        var tabButton = $('#navigation li').eq(buttonEQ).find('a');
        tabButton.click(function() {
            $(carouselID).carousel(0);
        })
    }

    this.iconNavigation = function(carouselID) {
        var icons = $(carouselID).find('.icon-navigation figure');
        icons.click(function() {
            icons.removeClass('active-icon');
            $(this).addClass('active-icon');
        })
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
    GSA.navigation.scrollorama();

    GSA.modals_carousels.modals();
    GSA.modals_carousels.carousels('#priorities-carousel');
    GSA.modals_carousels.slideItemHeight('#priorities-carousel');
    GSA.modals_carousels.carousels('#data-carousel');
    GSA.modals_carousels.slideItemHeight('#data-carousel');
    GSA.modals_carousels.slideFunction('#priorities-carousel');
    GSA.modals_carousels.slideFunction('#data-carousel');

    GSA.modals_carousels.goToSlide('#priorities-carousel', 2);
    GSA.modals_carousels.goToSlide('#data-carousel', 4);
    GSA.modals_carousels.iconNavigation('#data-carousel');
    GSA.modals_carousels.iconNavigation('#priorities-carousel');

    GSA.modals_carousels.modalPrint();


});