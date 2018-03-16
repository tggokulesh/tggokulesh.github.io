'use strict';

/**
 * @ngdoc function
 * @name protoApp.controller:PasttransCtrl
 * @description
 * # PasttransCtrl
 * Controller of the protoApp
 */
angular.module('protoApp')
  .controller('PasttransCtrl', function ($scope,$http,Auth,$routeParams) {
    
    var offers = [];
    var myOffers = [];
    $scope.trans = [];
    var trans = [];
    var email = $routeParams.email;
    $('html,body').scrollTop(0);
    $scope.view = false;

    var id = "#transStatus";

     
    

    $http.get("http://52.87.34.178:3000/api/GoodsListing/").then( (res =>{
          if(res.status === 200){
            console.log(res.data);
            offers = getMyTrans(res.data);
            for(var i=0;i<offers.length;i++){
              var current = offers[i];
              GetTransDetails(current);                
            };
            $scope.trans = trans;
            console.log($scope.trans.length);
        }
          
    })
  )


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
        'bank':offer.bank.split('#')[1]
        };

               

        trans.push(tran); 
         
        
    }

  });
