// Initialize AngularJS application
const app = angular.module('balancedBlissApp', []);
console.log('balancedBlissApp module defined');

// Controller for Index.html
app.controller('IndexController', ['$scope', '$http', function($scope, $http) {
    $scope.username = '';

    // Fetch username
    $http.get('/auth/get-user')
        .then(function(response) {
            $scope.username = response.data.username;
        })
        .catch(function(err) {
            console.error('Failed to fetch username:', err);
        });

    // Data for navigation
    $scope.navItems = [
        { id: "home", label: "Home" },
        { id: "about", label: "About" },
        { id: "reason", label: "Reason" },
        { id: "tips", label: "Tips" },
        { id: "reviews", label: "Reviews" }
    ];

    $scope.navigate = function(section) {
        document.getElementById(section).scrollIntoView({ behavior: "smooth" });
    };
}]);

// jQuery for UI interactions
$(document).ready(function() {
    $('.buttons').click(function() {
        $(this).addClass('active').siblings().removeClass('active');
        var filter = $(this).attr('data-filter');
        $('.tips .box').not('.' + filter).hide(100);
        $('.tips .box').filter('.' + filter).show(100);
    });

    $('.buttons[data-filter="sport"]').trigger('click');

    var swiper = new Swiper('.review-slider', {
        loop: true,
        grabCursor: true,
        spaceBetween: 20,
        breakpoints: {
            0: { slidesPerView: 1 },
            640: { slidesPerView: 2 },
            1200: { slidesPerView: 3 },
        },
    });

    let menuIcon = document.querySelector("#menu-icon");
    let navbar = document.querySelector(".navbar");

    menuIcon.onclick = () => {
        menuIcon.classList.toggle("fa-times");
        navbar.classList.toggle("active");
    };

    window.onscroll = () => {
        navbar.classList.remove("active");
    };
});

// Toggle reviews
function toggleReviews() {
    const container = document.getElementById('review-container');
    container.style.display = container.style.display === 'none' ? 'block' : 'none';

    if (container.style.display === 'block') {
        fetch('/reviews')
            .then((res) => res.json())
            .then((reviews) => {
                console.log('Fetched reviews:', reviews);
                if (!Array.isArray(reviews)) {
                    console.error('Invalid response format:', reviews);
                    alert('Failed to load reviews');
                    return;
                }
                const reviewList = document.getElementById('existing-reviews');
                reviewList.innerHTML = reviews
                    .map((review) => `<p><strong>${review.User?.username || 'Unknown User'}:</strong> ${review.content}</p>`)
                    .join('');
            })
            .catch((err) => {
                console.error('Error fetching reviews:', err);
                alert('Failed to load reviews');
            });
    }
}

// Submit review
function submitReview() {
    const content = document.getElementById('review-content').value;
    if (!content) {
        alert('Review cannot be empty!');
        return;
    }

    fetch('/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
    })
        .then((res) => res.json())
        .then((review) => {
            console.log('Review successfully submitted:', review);
            alert('Review submitted successfully!');
            document.getElementById('review-content').value = '';
            toggleReviews();
        })
        .catch((err) => {
            console.error('Error submitting review:', err);
            alert('Failed to submit review');
        });
}
