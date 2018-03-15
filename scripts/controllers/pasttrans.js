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
    
    
    
      
    // $http.get('http://52.87.34.178:3000/api/GoodsListing/').then((res =>{
    //   console.log(res.data.quantity);

    //   var tran = 
    //   {
    //   'quantity':res.data.quantity,
    //   'goodsId':res.data.goods.split('#')[1],
    //   'state':res.data.state,
    //   'status':res.data.state1,
    //   'price':res.data.Price,
    //   'participant':res.data.other.split('#')[1],
    //   };

    //     trans.push(tran);          
      
    //   // console.log(tran);
    // }))

    $http.get("http://52.87.34.178:3000/api/GoodsListing/").then( (res =>{
          if(res.status === 200){
            console.log(res.data[1]);
            offers = getMyTrans(res.data);
            for(var i=0;i<offers.length;i++){
              var current = offers[i];
              GetTransDetails(current);                
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
          return "yellow";
        }else{
          return "white";
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
