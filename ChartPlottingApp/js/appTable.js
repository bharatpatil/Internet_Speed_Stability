(function(){
  var sampleApp = angular.module('tableApp', ['ngTable']);
  
  sampleApp.filter('offset', function() {
    return function(input, start) {
      start = parseInt(start, 10);
      return input.slice(start);
    };
  });

  sampleApp.controller('TableController', function($scope, $http){
  	var app = this;
    $scope.itemsPerPage = 15;
    $scope.currentPage = 0;
    $scope.items = [];
    
  	$http.get("http://<SERVER IP>:3000/data").success(function (result){
      app.data = result;

      $scope.range = function() {
        var rangeSize = $scope.pageCount() + 1;
        var ret = [];
        var start;

        start = $scope.currentPage;
        if ( start > $scope.pageCount()-rangeSize ) {
          start = $scope.pageCount()-rangeSize+1;
        }

        for (var i=start; i<start+rangeSize; i++) {
          ret.push(i);
        }
        return ret;
      };

      $scope.prevPage = function() {
        if ($scope.currentPage > 0) {
          $scope.currentPage--;
        }
      };

      $scope.prevPageDisabled = function() {
        return $scope.currentPage === 0 ? "disabled" : "";
      };

      $scope.pageCount = function() {
        return Math.ceil(result.length/$scope.itemsPerPage)-1;
      };

      $scope.nextPage = function() {
        if ($scope.currentPage < $scope.pageCount()) {
          $scope.currentPage++;
        }
      };

      $scope.nextPageDisabled = function() {
        return $scope.currentPage === $scope.pageCount() ? "disabled" : "";
      };

      $scope.setPage = function(n) {
        $scope.currentPage = n;
      };
	  })
  }) 
})();