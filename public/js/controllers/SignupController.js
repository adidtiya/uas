angular.module('balancedBlissApp')
    .controller('SignupController', ['$scope', '$http', function($scope, $http) {
        console.log('SignupController loaded');
        // Initialize user object
        $scope.user = {};

        // Signup function
        $scope.signup = function() {
            $http.post('/auth/signup', $scope.user)
                .then(function(response) {
                    alert('Signup successful: ' + response.data.message);
                    window.location.href = '/login.html';
                })
                .catch(function(err) {
                    console.error('Signup failed:', err);
                    const errorMsg = err.data?.error || 'An error occurred during signup.';
                    alert('Signup failed: ' + errorMsg);
                });
        };
        
    }]);
