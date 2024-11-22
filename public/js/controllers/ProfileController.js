angular.module('balancedBlissApp')
    .controller('ProfileController', ['$scope', '$http', function($scope, $http) {
        $scope.user = {};
        $scope.isEditing = false; // Edit mode off by default
        $scope.newPhoto = null;

        // Fetch user data
        $http.get('/auth/get-user')
            .then(function(response) {
                $scope.user = response.data;
            })
            .catch(function(err) {
                console.error('Error fetching user data:', err);
                window.location.href = '/login.html'; // Redirect to login if not logged in
            });

        // Toggle edit mode
        $scope.toggleEdit = function() {
            $scope.isEditing = !$scope.isEditing; // Toggle edit mode
        };

        // Save updated profile
        $scope.saveProfile = function() {
            const formData = new FormData();
            formData.append('username', $scope.user.username);
            if (document.getElementById('uploadPhoto').files.length > 0) {
                formData.append('profilePhoto', document.getElementById('uploadPhoto').files[0]);
            }

            $http.put('/auth/update-profile', formData, {
                headers: { 'Content-Type': undefined },
            })
            .then(function(response) {
                alert('Profile updated successfully!');
                $scope.isEditing = false; // Exit edit mode
                if (response.data.photoUrl) {
                    $scope.user.profilePhoto = response.data.photoUrl; // Update photo in UI
                }
            })
            .catch(function(err) {
                console.error('Error updating profile:', err);
                alert('Failed to update profile.');
            });
        };

        // Cancel edit
        $scope.cancelEdit = function() {
            $scope.isEditing = false; // Exit edit mode
            $http.get('/auth/get-user') // Reload original data
                .then(function(response) {
                    $scope.user = response.data;
                });
        };

        // Logout function
        $scope.logout = function() {
            $http.post('/auth/logout')
                .then(function() {
                    window.location.href = '/index.html';
                })
                .catch(function(err) {
                    console.error('Logout failed:', err);
                });
        };
    }]);
