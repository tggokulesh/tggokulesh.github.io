'use strict';

/**
 * @ngdoc function
 * @name protoApp.controller:InventoryCtrl
 * @description
 * # InventoryCtrl
 * Controller of the protoApp
 */
angular.module('protoApp')
  .controller('InventoryCtrl', function ($scope,$http,$routeParams) {
    $scope.goods = [];
    $scope.$on('isAuthenticated',function(event,data){
      if(data){
        $scope.isAuthenticated = true;
      }else{
        $location.url('/login');
      }
    });

    var email = $routeParams.email;
    $http.get('http://52.87.34.178:3000/api/Goods').then( (response => {
      $scope.goods = response.data;
    }))
  });
