'use strict';

/**
 * @ngdoc function
 * @name protoApp.controller:BalanceCtrl
 * @description
 * # BalanceCtrl
 * Controller of the protoApp
 */
angular.module('protoApp')
  .controller('BalanceCtrl', function ($scope,$http,$mdPanel,$mdToast,$rootScope,$routeParams) {

    $scope.retailer = {};
    $scope.view = true;
    $scope.$on('isAuthenticated',function(event,data){
      if(data){
        $scope.isAuthenticated = true;
      }else{
        $location.url('/login');
      }
    });

    var offers = [];
    var myOffers = [];
    $scope.trans = [];
    var trans = [];
    var email = $routeParams.email;

    $http.get("http://52.87.34.178:3000/api/Retailer/"+email).then( (res =>{
      if(res.status ===200){
        $scope.retailer = res.data;        
      }
    }))

    function getMyTrans(offers) {
      for(var j=0;j<offers.length;j++){
        if(offers[j].retailer.localeCompare("resource:org.acme.retail.Retailer#"+$scope.retailer.email)==0){
          myOffers.push(offers[j]);
        }
      }
      return myOffers;
    }
    $scope.hideTrans  = function(){
      // location.reload();
      $scope.trans.length = 0;
      $scope.view = true;
      
    }
    $scope.viewTrans = function(){
      
      $http.get("http://52.87.34.178:3000/api/Offer/").then( (res =>{
            if(res.status === 200){
              offers = getMyTrans(res.data);
              // console.log(offers[0].transactionId);    
              for(var i=0;i<offers.length;i++){
                var current = offers[i];
                GetTransDetails(current);                
              };
              $scope.view = false;
              $scope.trans = trans;
              trans.length = 0;
              offers.length = 0;
              console.log("CHECKING"+trans);
              $scope.trans.sort(function(x, y){
                return x.time - y.time;
            })
          }
            
      })
    )
    };

    function GetTransDetails(offer){
      $http.get('http://52.87.34.178:3000/api/GoodsListing/'+offer.listing.split('#')[1]).then((res =>{
        console.log(res.data.quantity);

        var tran = 
        {'transactionId':offer.transactionId,
        'quantity':res.data.quantity,
        'goodsId':res.data.goods.split('#')[1],
        'state':res.data.state,
        'price':res.data.Price,
        'participant':offer.other.split('#')[1],
        'time':offer.timestamp
        };

        if(trans.length<5){
          trans.push(tran);          
        }
        console.log(tran);
  }))
    }
  });
