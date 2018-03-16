'use strict';

/**
 * @ngdoc function
 * @name protoApp.controller:ProfileCtrl
 * @description
 * # ProfileCtrl
 * Controller of the protoApp
 */
angular.module('protoApp')
  .controller('ProfileCtrl', function ($scope,$http,$mdPanel,$mdToast,$rootScope,$routeParams) {

    $scope.retailer = {};
    $scope.view = true;

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
      myOffers = [];
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

      $scope.trans.length = 0;
      trans.length = 0;
      offers.length = 0;
      $scope.view = false;
      
      $http.get("http://52.87.34.178:3000/api/GoodsListing/").then( (res =>{
          if(res.status === 200){
            console.log(res.data[1]);
            offers = getMyTrans(res.data);
            for(var i=0;i<offers.length;i++){
              var current = offers[i];
              if(i<3){
                GetTransDetails(current);                
              }
            };
            $scope.trans = trans;
            console.log($scope.trans.length);
            //offers.length = 0;
            //trans.length = 0;
            // offers.length = 0;
            // console.log("CHECKING"+t);
          //   $scope.trans.sort(function(x, y){
          //     return x.time - y.time;
          // })
        }
          
    })
  )
    }

  function getMyTrans(offers) {
    for(var j=0;j<offers.length;j++){
      if(offers[j].retailer.localeCompare("resource:org.acme.retail.Retailer#"+email)==0){
        myOffers.push(offers[j]);
      }
    }
    return myOffers;
  }

   
    $scope.selectColor = function(tran){
    
      if(tran.status==="Pending"){
        return "orange";
      }else if(tran.status==="Accepted"){
        return "green";
      }else{
        return "red";
      }
  }

    function GetTransDetails(offer){
        console.log("GIT");

        var tran = 
        {
        'quantity':offer.quantity,
        'goodsId':offer.goods.split('#')[1],
        'state':offer.state,
        'status':offer.state1,
        'price':offer.Price,
        'participant':offer.other.split('#')[1],
        // 'bank':offer.bank.split('#')[1]
        };

          trans.push(tran);          
        
    }
    
  });
