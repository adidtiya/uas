$(document).ready(function(){

    $('.buttons').click(function(){

        $(this).addClass('active').siblings().removeClass('active');

        var filter = $(this).attr('data-filter')

            $('.tips .box').not('.' + filter).hide(100);
            $('.tips .box').filter('.' + filter).show(100);

    });

    $('.buttons[data-filter="sport"]').trigger('click');

});


$(document).ready(function() {
    var swiper = new Swiper('.review-slider', {
        loop: true,
        grabCursor: true,
        spaceBetween: 20,
        breakpoints: {
            0: {
                slidesPerView: 1,
            },
            640: {
                slidesPerView: 2,
            },
            1200: {
                slidesPerView: 3,
            },
        },
    });

    // Toggle menu for mobile
    let menuIcon = document.querySelector("#menu-icon");
    let navbar = document.querySelector(".navbar");

    menuIcon.onclick = () => {
        menuIcon.classList.toggle("fa-times");
        navbar.classList.toggle("active");
    };

    // Close menu when scrolling
    window.onscroll = () => {
        navbar.classList.remove("active");
    };

    $(document).ready(function() {
        $('.navbar a').click(function() {
            $('#menu-icon').removeClass('fa-times');
            $('.navbar').removeClass('active');
        });
    
        $(window).resize(function() {
            if ($(window).width() > 768) {
                $('#menu-icon').removeClass('fa-times');
                $('.navbar').removeClass('active');
            }
        });
    });
    
});
