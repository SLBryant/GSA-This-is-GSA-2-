if(!GSA){
    var GSA = {}
}
var gaDimensions = {};
var gaCrumb = window.location.href.split('gsa.gov')[1];

var ieUserAgent = {
    init: function () {
        // Get the user agent string
        var ua = navigator.userAgent;
        this.compatibilityMode = false;
        console.log('ua: '+ua);

        // Detect whether or not the browser is IE
        var ieRegex = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
        if (ieRegex.exec(ua) == null)
            this.exception = "The user agent detected does not contain Internet Explorer.";

        // Get the current "emulated" version of IE
        this.renderVersion = parseFloat(RegExp.$1);
        this.version = this.renderVersion;

        // Check the browser version with the rest of the agent string to detect compatibility mode
        if (ua.indexOf("Trident/6.0") > -1) {
            if (ua.indexOf("MSIE 7.0") > -1) {
                this.compatibilityMode = true;
                this.version = 10;
            }
        }
        else if (ua.indexOf("Trident/5.0") > -1) {
            if (ua.indexOf("MSIE 7.0") > -1) {
                this.compatibilityMode = true;
                this.version = 9;
            }
        }
        else if (ua.indexOf("Trident/4.0") > -1) {
            if (ua.indexOf("MSIE 7.0") > -1) {
                this.compatibilityMode = true;
                this.version = 8;
            }
        }
        else if (ua.indexOf("MSIE 7.0") > -1)
            this.version = 7;
        else
            this.version = 6;
    }
};

GSA.images = new function(){

    this.cacheImages = function() {
        $.fn.preload = function() {
            this.each(function(){
                $('<img/>')[0].src = this;
            });
        }

        $(['images/Banner-DFC-SolarPanel.jpg', 'images/Banner-MoffetHanger.jpg', 'images/Banner-Infill-Area.jpg', 'images/Banner-SanYsidro.jpg']).preload();
    }

    this.introBackgroundRotator = function() {
        var images = ['images/Banner-DFC-SolarPanel.jpg', 'images/Banner-MoffetHanger.jpg', 'images/Banner-Infill-Area.jpg', 'images/Banner-SanYsidro.jpg'];
        var caption = ['Solar panel array at the Denver Federal Center, Denver, Colo.', 'Hangar One at Moffett Federal Airfield, Mountain View, Calif.','Technology in collaborative workspaces at GSA Headquarters, Washington, D.C.', 'San Ysidro Land Port of Entry, San Ysidro, Calif.' ];
        var tags = ['Photo of a solar panel array at the GSA-owned Denver Federal Center in Denver, Colorado', 'Photo of the side view of Hangar One, an airship storage facility in Mountain View, CA, and one of the largest freestanding structures in the world.', 'Photo of the interior of a collaborative office space at GSA Headquarters in Washington, DC', 'Photo of the busy San Ysidro land port of entry in San Ysidro, California'];
        var randomNumber = Math.floor(Math.random() * images.length);
        $('#intro').css({'background-image' : 'url(' + images[randomNumber] + ')'});
        $('#intro footer p').text(caption[randomNumber]);
        setInterval(function() {
            if(randomNumber == images.length -1) {
                randomNumber = 0;
            } else {
                randomNumber ++;
            }
            $('#intro').css({'background-image' : 'url(' + images[randomNumber] + ')'}).attr('alt',tags[randomNumber]);
            $('#intro footer p').text(caption[randomNumber]);
        },8000);
    }

    var p = [ 645,629,648 ];
    var start = 645;
    var next = p[($.inArray(start, p) + 1) % p.length];
    var prev = p[($.inArray(start, p) - 1 + p.length) % p.length];

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
                if(id != 'intro') {
                    History.pushState(null, 'This is GSA',id);
                };
            }
        });
    };

    this.scrollToSection = function() {
        menuItems.click(function(e){
            var href = $(this).attr('href'),
                offsetTop;
                if(href == '#intro') {
                    offsetTop = href === "#" ? 0 : $(href).offset().top;
                } else {
                    offsetTop = href === "#" ? 0 : $(href).offset().top - topMenuHeight + 1;
                }
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
                $('#mission').css('margin-top','50px');
            } else {
                topMenu.removeClass('locked');
                $('#mission').css('margin-top','0');
            }
        });
    }

    this.scrollorama = function() {
        controller.addTween(
            '#intro',
            (new TimelineLite())
                .append([
                    TweenMax.fromTo($('#GSA-small'),.9,
                        {css: {opacity:0}, immediateRender: true},
                        {css: {opacity : 1}}),
                    TweenMax.fromTo($('#thisIs-small'),.9,
                        {css: {opacity:0}, immediateRender: true},
                        {css: {opacity : 1}})
                ]),
            340);
    }
};

GSA.modals_carousels = new function() {
    var modalTemplate = $('#modalView');
    var button = '';
    modalTemplate.modal({ show: false});

    this.modals = function () {
        modalTemplate.modal({ show: false}); // on load modal is not initiated

        $('.foursquare article').click(function() { // initiate modal on click
            if($(this).attr('id')) {
                $('.modal-content').css('max-height', $(window).height() - 50);
                button = $(this);
                modalTemplate.modal('show');
            }
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
                $('#header-catcher').html('<article class="col-sm-10">' +
                '<div class="no-pad-left">' +
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

                $( "#content-catcher" ).print();

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
            History.pushState(null,'This is GSA','#slide-'+slideNum);
             var triggerElement = document.activeElement;
             triggerElement.focus();
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
        });
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

    //console.log polyfill for IE
    if ( ! window.console ) console = { log: function(){} };

    // Initialize the ieUserAgent object
    ieUserAgent.init();


    GSA.images.cacheImages();
    GSA.images.introBackgroundRotator();

    GSA.navigation.stickyNav();
    GSA.navigation.scrollorama();
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


    var dataHeight = $('#data').height(),
        windowHeight = $(window).height(),
        paddingNeeded = windowHeight - dataHeight;
    $('#data .item').css('padding-bottom',paddingNeeded);


    // Do stuff
    if (ieUserAgent.compatibilityMode == true){
        if(ieUserAgent.version === 8){
            $('#ieModal').modal({ show: true});
            $('.compatibility-mode-resource').attr('href','https://answers.microsoft.com/en-us/ie/forum/ie8-windows_7/turn-off-compatibility-view/33bb7aaf-ab73-47e6-8b5d-d466162ee1cc')
        }
        if(ieUserAgent.version === 9){
            $('#ieModal').modal({ show: true});
            $('.compatibility-mode-resource').attr('href','http://windows.microsoft.com/en-us/internet-explorer/products/ie-9/features/compatibility-view')
        }
    }


});