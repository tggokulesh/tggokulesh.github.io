'use strict';

/**
 * @ngdoc function
 * @name protoApp.controller:TransreqCtrl
 * @description
 * # TransreqCtrl
 * Controller of the protoApp
 */
angular.module('protoApp')
  .controller('TransreqCtrl', function($scope,$http,$mdDialog,$mdToast,$rootScope,$routeParams,$location) {

      $scope.view = false;
      $scope.complete = false;
      var index = 0;
      var offers = [];
      var myOffers = [];
      $scope.trans = [];
      var trans = [];
      var email = $routeParams.email;

      $('html,body').scrollTop(0);
      $scope.isreq = false;
      var last = {
        bottom: false,
        top: true,
        left: false,
        right:true
      };

     

      $scope.toastPosition = angular.extend({},last);

      $scope.getToastPosition = function() {
        sanitizePosition();

      return Object.keys($scope.toastPosition)
        .filter(function(pos) { return $scope.toastPosition[pos]; })
        .join(' ');
      };

      function sanitizePosition() {
        var current = $scope.toastPosition;

        if ( current.bottom && last.top ) current.top = false;
        if ( current.top && last.bottom ) current.bottom = false;
        if ( current.right && last.left ) current.left = false;
        if ( current.left && last.right ) current.right = false;

        last = angular.extend({},current);
      }

      function  showSimpleToast(message) {
        var pinTo = $scope.getToastPosition();
    
        $mdToast.show(
          $mdToast.simple()
            .textContent(message)
            .parent(document.querySelectorAll('#toaster'))
            .position(pinTo)
            .hideDelay(3000)
        );
      };

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

      $http.get("http://52.87.34.178:3000/api/GoodsListing/").then( (res =>{
          if(res.status === 200){
            offers = getMyTrans(res.data);
            console.log("FF");
            for(var i=0;i<offers.length;i++){
              var current = offers[i];
              filterRequests(current);
            };
            $scope.trans = trans;
            
            console.log($scope.trans.length);
        }
          
    })
  )

  function getMyTrans(offers) {
    myOffers.length = 0;
    for(var j=0;j<offers.length;j++){
      if(offers[j].other.localeCompare("resource:org.acme.retail.Other#"+email)==0 && offers[j].state1.localeCompare("Pending")==0){
        myOffers.push(offers[j]);
      }
    }
    if(myOffers.length ==0){
      $scope.isreq = true;
      $scope.complete = true;
    }

    return myOffers;
  }
  
  function filterRequests(offer){
    console.log("GEEEDW");
    $http.get("http://52.87.34.178:3000/api/FinanceRequest/").then( (res =>{
          if(res.status === 200){
            console.log("FW");
            filterAcceptedones(res.data,offer);
            
        }
          
    }))
  }



  function populate(offer,fin_req){
    if(offer.ListingID.localeCompare(fin_req.listing.split('#')[1])==0){
      if(fin_req.request.localeCompare("Accepted")==0 || fin_req.financing.localeCompare("Not_required")==0){
        $scope.isreq = false;
        var request;
        var financing;

        if(fin_req.financing== "Not_required"){
          request = "NA";
          financing = "Not_required";
        }else{
          financing = fin_req.financing;
          request = fin_req.request;
        }

        
        $http.get("http://52.87.34.178:3000/api/Goods/"+offer.goods.split('#')[1]).then((res =>{
          var Description = res.data.Description;
          // console.log(good);

        var tran = 
        {
        'ListingID':offer.ListingID,
        'quantity':offer.quantity,
        'retailer':offer.retailer.split('#')[1],
        'goodsId':offer.goods.split('#')[1],
        'des':Description,
        'state':offer.state,
        'status':offer.state1,
        'price':offer.Price,
        'participant':offer.other.split('#')[1],
        'bank':offer.bank.split('#')[1],
        'request':"resource:org.acme.retail.FinanceRequest#"+fin_req.RequestID,
        'finSup':financing,
        'finStatus':request
        };

        console.log("CJECK");
        trans.push(tran); 
        $scope.complete = true;
        }))
      }else{
        // $scope.complete = false;
        // $scope.isreq = true
      }
    }else{
      $scope.complete = true;
      $scope.isreq = true;
    }
  }


  function filterAcceptedones(fin_reqs,offer){
    index = fin_reqs.length;
    console.log(fin_reqs);
    var i;
    for(i=0;i<fin_reqs.length;i++){
      var current = fin_reqs[i];
      populate(offer,current);
     
    }

    if(i==fin_reqs.length-1){
      console.log(i);
      $scope.complete= true;
    }
  }


  function showDialog(message) {

    alert = $mdDialog.alert({
      title: 'Congratulations',
      textContent: message,
      ok: 'Close'
    });

    $mdDialog
      .show( alert )
      .finally(function() {
        alert = undefined;
        location.reload();               
      });
}

      var accept = false;

      $scope.showConfirm = function(ev,tran) {
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.confirm()
              .title('Would you like to accept the transaction?')
              .textContent('Approve the transaction if you want to complete it')
              .ariaLabel('Lucky day')
              .targetEvent(ev)
              .ok('Accept')
              .cancel('Reject');
    
        $mdDialog.show(confirm).then(function() {
          accept = true;
          approveRequest(tran);
        }, function() {
          accept = false;
          approveRequest(tran);
          // showSimpleToast("Cancelled!");
        });
      };

      function approveRequest(tran){
        
        var Trans_obj =
        {
          "$class": "org.acme.retail.OfferAccept",
          "listing":"resource:org.acme.retail.GoodsListing#"+tran.ListingID,
          "request":tran.request,
          "other":"resource:org.acme.retail.Other#"+email,
          "retailer":tran.retailer,
          "bank":"resource:org.acme.retail.Bank#"+tran.bank,
          "transactionId": "",
          "timestamp": Date.now()
        };

        if(accept){
          $http.post('http://52.87.34.178:3000/api/OfferAccept/',Trans_obj).then((res =>{
            showDialog("Successfully approved the transaction");
          }))
        
        }else if(!accept){
          Trans_obj.$class = "org.acme.retail.OfferReject"
          $http.post('http://52.87.34.178:3000/api/OfferReject/',Trans_obj).then((res =>{
            showDialog("Rejected the transaction");
          }))
        }
    }
            
  });
