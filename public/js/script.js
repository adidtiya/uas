// Initialize AngularJS application
const app = angular.module('balancedBlissApp', []); // Define and assign the app module
console.log('balancedBlissApp module defined');

// Controller for Index.html
app.controller('IndexController', ['$scope', function($scope) {
    // Data for navigation
    $scope.navItems = [
        { id: "home", label: "Home" },
        { id: "about", label: "About" },
        { id: "reason", label: "Reason" },
        { id: "tips", label: "Tips" },
        { id: "reviews", label: "Reviews" }
    ];

    // Function to navigate to specific sections
    $scope.navigate = function(section) {
        document.getElementById(section).scrollIntoView({ behavior: "smooth" });
    };
}]);

// jQuery for UI interactions
$(document).ready(function() {
    // Filter for tips section
    $('.buttons').click(function() {
        $(this).addClass('active').siblings().removeClass('active');
        var filter = $(this).attr('data-filter');
        $('.tips .box').not('.' + filter).hide(100);
        $('.tips .box').filter('.' + filter).show(100);
    });

    // Default filter for sport category
    $('.buttons[data-filter="sport"]').trigger('click');

    // Swiper for reviews slider
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
});
