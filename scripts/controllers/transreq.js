'use strict';

/**
 * @ngdoc function
 * @name protoApp.controller:TransreqCtrl
 * @description
 * # TransreqCtrl
 * Controller of the protoApp
 */
angular.module('protoApp')
  .controller('TransreqCtrl', function($scope,$http,$mdDialog,$mdToast,$rootScope,$routeParams) {

      $scope.view = false;
  
      var offers = [];
      var myOffers = [];
      $scope.trans = [];
      var trans = [];
      var email = $routeParams.email;

      $('html,body').scrollTop(0);

      var last = {
        bottom: false,
        top: true,
        left: false,
        right:true
      };

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
                
            }
              
        })
      )

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

      $scope.showConfirm = function(ev,tran) {
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.confirm()
              .title('Would you like to approve the transaction?')
              .textContent('Approve the transaction if you want to complete it!')
              .ariaLabel('Lucky day')
              .targetEvent(ev)
              .ok('Accept')
              .cancel('Cancel');
    
        $mdDialog.show(confirm).then(function() {
          approveRequest(tran);
        }, function() {
          showSimpleToast("Cancelled!");
        });
      };

      function approveRequest(tran){
        var GoodsListing = {};
        $http.get('http://52.87.34.178:3000/api/GoodsListing/'+tran.listingId).then((res =>{
          console.log(res.data.state1);
          GoodsListing = res.data;
          GoodsListing.state1 = "Accepted";
          updateGoodsListing(GoodsListing);
        }))
    }

      function updateGoodsListing(GoodsListing){
        var reqBody = 
        {
          "$class": "org.acme.retail.GoodsListing",
          "rhash": GoodsListing.rhash,
          "quantity": GoodsListing.quantity,
          "Price": GoodsListing.Price,
          "state": GoodsListing.state,
          "ostate": GoodsListing.ostate,
          "state1": GoodsListing.state1,
          "goods": GoodsListing.goods,
          "other": GoodsListing.other,
          "retailer": GoodsListing.retailer
        };
        
        $http.put('http://52.87.34.178:3000/api/GoodsListing/'+GoodsListing.ListingID,reqBody).then((res =>{
          console.log("PUT"+res.data.state1);
          showSimpleToast("Approved!");
        })).catch((err =>{
          showSimpleToast("Error occured");
        }))

      }
  
      function getMyTrans(offers) {
        for(var j=0;j<offers.length;j++){
          if(offers[j].other.localeCompare("resource:org.acme.retail.Other#"+email)==0){
            myOffers.push(offers[j]);
          }
        }
        return myOffers;
      }

      $scope.hideTrans  = function(){
        $scope.trans.length = 0;
        $scope.view = true;
        
      }

        
        
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
          'listingId':res.data.ListingID,
          'quantity':res.data.quantity,
          'goodsId':res.data.goods.split('#')[1],
          'state':res.data.state,
          'status':res.data.state1,
          'price':res.data.Price,
          'participant':offer.other.split('#')[1],
          'time':offer.timestamp
          };
  
          trans.push(tran); 
                   
          console.log(tran);
    }))
      }
  });
