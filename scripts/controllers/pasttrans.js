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
    var allfinReq = [];
    var id = "#transStatus";
    $scope.complete = false;
    $scope.isreq = false;
    

    $http.get("http://52.87.34.178:3000/api/GoodsListing/").then( (res =>{
          if(res.status === 200){
            console.log(res.data);
            offers = getMyTrans(res.data);
            getAllfinReq();
            for(var i=0;i<offers.length;i++){
              var current = offers[i];
              GetTransDetails(current);                
            };

            if(trans.length ==0){
              $scope.isreq = true;
            }else{
              $scope.isreq = false;
            }
            
            $scope.trans = trans;
            console.log($scope.trans.length);
        }
          
    })
  )

  function getAllfinReq(){

    allfinReq.length = 0;
   
return allfinReq;
  }
  


  function getMyTrans(offers) {
    for(var j=0;j<offers.length;j++){
      if(offers[j].retailer.localeCompare("resource:org.acme.retail.Retailer#"+email)==0){
        myOffers.push(offers[j]);
      }
    }
    if(myOffers.length==0){
      $scope.complete  = true;
      $scope.isreq = true;
    }
    return myOffers;
  }

    $scope.selectColor = function(status){
    
        if(status==="Pending"){
          return "orange";
        }else if(status==="Accepted"){
          return "green";
        }else if(status==="Rejected"){
          return "red";
        }else{
          return "#FFFFCC";
        }
    }

    function GetFinRequests(offer){
      var financing;
      var request;
      for(var j=0;j<allfinReq.length;j++){
        if(allfinReq[j].listing.localeCompare("resource:org.acme.retail.GoodsListing#"+offer.ListingID)==0){
          financing = allfinReq[j].financing;
          request = allfinReq[j].request;
        }
      }
      return [financing,request]
    }


    
    function GetTransDetails(offer){
        console.log("GIT");

        $http.get("http://52.87.34.178:3000/api/FinanceRequest/").then((res =>{

          console.log(res.data);
          allfinReq = res.data;
          var fin_det = [];
        var financing = "Not_required";
        var request = "NA";
        var txn_status = offer.state1;

        fin_det = GetFinRequests(offer);
        financing = fin_det[0];
        request = fin_det[1];
        console.log("FFF"+request);
        if(financing === "Not_required"){
          request = "NA";
        }else if(financing === "Required"){
          if(request==="Rejected"){
            txn_status = "NA";
          }
        }

        $http.get("http://52.87.34.178:3000/api/Goods/"+offer.goods.split('#')[1]).then((res =>{
            var Description = res.data.Description;
            // console.log(good);
        var tran = 
        {
        'quantity':offer.quantity,
        'des':Description,
        'goodsId':offer.goods.split('#')[1],
        'state':offer.state,
        'status':txn_status,
        'price':offer.Price,
        'participant':offer.other.split('#')[1],
        'bank':offer.bank.split('#')[1],
        'finSup':financing,
        'finStatus':request
        };
        
        trans.push(tran); 
        $scope.complete = true;
        
        if(trans.length ==0){
          $scope.isreq = true;
        }else{
          $scope.isreq = false;
        }
      }));
        
    })
    );
        
        
    }

  });
