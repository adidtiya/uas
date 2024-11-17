// Inisialisasi aplikasi AngularJS
const app = angular.module('balancedBlissApp', []);

// Controller untuk Index.html
app.controller('IndexController', function($scope) {
    // Data untuk navigasi
    $scope.navItems = [
        { id: "home", label: "Home" },
        { id: "about", label: "About" },
        { id: "reason", label: "Reason" },
        { id: "tips", label: "Tips" },
        { id: "reviews", label: "Reviews" }
    ];


    // Fungsi untuk menavigasi ke bagian tertentu
    $scope.navigate = function(section) {
        document.getElementById(section).scrollIntoView({ behavior: "smooth" });
    };

});

// Define the AngularJS SignupController
app.controller('SignupController', function($scope, $http) {
    // Initialize user object
    $scope.user = {};

    // Signup function
    $scope.signup = function() {
        // Debug log: Check if the function is being called
        console.log('Signup initiated:', $scope.user);

        $http.post('/auth/signup', $scope.user, {
            headers: { 'Content-Type': 'application/json' }
        })
        .then(function(response) {
            console.log('Signup response:', response);
            alert('Signup successful: ' + response.data.message);
            window.location.href = '/login.html';
        })
        .catch(function(err) {
            console.error('Signup failed:', err);
            alert('Signup failed: ' + (err.data.error || err.message));
        });
        
        
    };
});

app.controller('LoginController', function($scope, $http) {
    $scope.user = {};

    $scope.login = function() {
        $http.post('/auth/login', $scope.user)
            .then(response => {
                alert(response.data.message);
                window.location.href = 'index.html';
            })
            .catch(err => alert(err.data.error));
    };
});



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
