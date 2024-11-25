angular.module('balancedBlissApp')
    .controller('ProfileController', ['$scope', '$http', function($scope, $http) {
        $scope.user = {};
        $scope.isEditing = false;

        // Fetch user data
        $http.get('/auth/get-user')
            .then(function(response) {
                $scope.user = response.data;
            })
            .catch(function(err) {
                console.error('Error fetching user data:', err);
                window.location.href = '/login.html'; // Redirect to login if not authenticated
            });

        // Toggle edit mode
        $scope.toggleEdit = function() {
            $scope.isEditing = !$scope.isEditing;
        };

        // Save updated profile
        $scope.saveProfile = function() {
            const formData = new FormData();
            formData.append('username', $scope.user.username);
            const fileInput = document.getElementById('uploadPhoto');
            if (fileInput.files[0]) {
                formData.append('profilePhoto', fileInput.files[0]);
            }

            $http.put('/auth/update-profile', formData, {
                headers: { 'Content-Type': undefined },
            }).then(response => {
                alert('Profile updated successfully!');
                $scope.user.profilePhoto = response.data.photoUrl; // Update photo
                $scope.isEditing = false;
            }).catch(err => {
                console.error('Error updating profile:', err);
                alert('Failed to update profile.');
            });
        };

        // Cancel edit
        $scope.cancelEdit = function() {
            $scope.isEditing = false;
        };

        // Logout
        $scope.logout = function() {
            $http.post('/auth/logout')
                .then(function() {
                    window.location.href = '/index.html';
                })
                .catch(function(err) {
                    console.error('Logout failed:', err);
                });
        };

        // Redirect to main menu
        $scope.goToMainMenu = function() {
            window.location.href = '/index.html';
        };

        // Delete account
        $scope.deleteAccount = function() {
            if (confirm('Are you sure you want to delete your account?')) {
                $http.delete('/auth/delete-account')
                    .then(function(response) {
                        alert('Account deleted successfully!');
                        window.location.href = '/index.html';
                    })
                    .catch(function(err) {
                        console.error('Failed to delete account:', err);
                        alert('Failed to delete account.');
                    });
            }
        };
    }]);
