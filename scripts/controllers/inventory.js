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
    var myGoods = [];
    
    var email = $routeParams.email;

    function getMyGoods(goods) {
      for(var j=0;j<goods.length;j++){
        if(goods[j].retailer.localeCompare("resource:org.acme.retail.Retailer#"+email)==0){
          myGoods.push(goods[j]);
        }
      }
      return myGoods;
    }

    $http.get('http://52.87.34.178:3000/api/Goods').then( (response => {
      $scope.goods = getMyGoods(response.data);
    }))
  });
