'use strict';

/**
 * @ngdoc function
 * @name protoApp.controller:InventoryCtrl
 * @description
 * # InventoryCtrl
 * Controller of the protoApp
 */
angular.module('protoApp')
  .controller('InventoryCtrl', function ($scope,$http) {
    $scope.goods = [];
    $http.get('http://52.87.34.178:3000/api/Goods').then( (response => {
      $scope.goods = response.data;
    }))
  });
