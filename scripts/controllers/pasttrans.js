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

    function getMyTrans(offers) {
      for(var j=0;j<offers.length;j++){
        if(offers[j].retailer.localeCompare("resource:org.acme.retail.Retailer#"+email)==0){
          myOffers.push(offers[j]);
        }
      }
      return myOffers;
    }
    
      
    $http.get("http://52.87.34.178:3000/api/Offer/").then( (res =>{
          if(res.status === 200){
            offers = getMyTrans(res.data);
            for(var i=0;i<offers.length;i++){
              var current = offers[i];
              GetTransDetails(current);                
            };
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

    $scope.selectColor = function(tran){
      
        if(tran.status==="Pending"){
          return "yellow";
        }else{
          return "white";
        }
    }
    function GetTransDetails(offer){
      $http.get('http://52.87.34.178:3000/api/GoodsListing/'+offer.listing.split('#')[1]).then((res =>{
        console.log(res.data.quantity);

        var tran = 
        {'transactionId':offer.transactionId,
        'quantity':res.data.quantity,
        'goodsId':res.data.goods.split('#')[1],
        'state':res.data.state,
        'status':res.data.state1,
        'price':res.data.Price,
        'participant':offer.other.split('#')[1],
        'time':offer.timestamp
        };

          trans.push(tran);          
        
        // console.log(tran);
  }))
    }

  });
