app.controller('IndexController', ['$scope', '$http', function($scope, $http) {
    $scope.username = null;

    // Fetch current user
    $http.get('/auth/get-user')
        .then(function(response) {
            $scope.username = response.data.username;
        })
        .catch(function() {
            $scope.username = null; // Not logged in
        });
}]);
