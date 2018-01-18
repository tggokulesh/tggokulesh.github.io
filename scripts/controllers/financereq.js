'use strict';

/**
 * @ngdoc function
 * @name protoApp.controller:FinancereqCtrl
 * @description
 * # FinancereqCtrl
 * Controller of the protoApp
 */
angular.module('protoApp')
  .controller('FinancereqCtrl', function ($scope,$http,$mdDialog,$mdToast,$rootScope,$routeParams,$q) {

      $scope.view = false;

      var offers = [];
      var fin_offers = [];
      var myOffers = [];
      $scope.fin_offers = [];
      var email = $routeParams.email;
      $scope.acceptStatus = false;  
      var fin_reqs = [];

      var last = {
        bottom: false,
        top: true,
        left: false,
        right:true
      };

      $http.get("http://52.87.34.178:3000/api/Offer/").then((res =>{

                offers = getMyTrans(res.data);
                console.log(offers);
                $http.get("http://52.87.34.178:3000/api/FinanceRequest").then((res =>{
                  for(var i=0;i<offers.length;i++){
                    for(var j=0;j<fin_reqs.length;j++){
                      if(fin_reqs[j].listing.localeCompare(offer.listing)==0){
                        if(fin_reqs[j].financing.localeCompare("Need")){
                          fin_offers.push(fin_reqs[j]);
                        }
                      }
                    }
                  };
                  $scope.fin_offers = fin_offers;                  
                  fin_offers.length = 0;
                  offers.length = 0;    
                }));            
              
        })
      );
      

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

      $scope.showConfirm = function(ev,fin_offer) {
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.confirm()
              .title('Would you like to provide financing?')
              .textContent('Accept to provide financing to the retailer!')
              .ariaLabel('Lucky day')
              .targetEvent(ev)
              .ok('Accept')
              .cancel('Cancel');
    
        $mdDialog.show(confirm).then(function() {
          approveRequest(fin_offer);
        }, function() {
          showSimpleToast("Cancelled!");
        });
      };

      function approveRequest(fin_offer){
        var finReq = {};
        $http.get('http://52.87.34.178:3000/api/FinanceRequest/'+fin_offer.RequestID).then((res =>{
          console.log(res.data.request);
          finReq = res.data;
          finReq.request = "Accepted";
          updateFinReq(finReq);
        }))
      }

      function updateFinReq(finReq){
        var reqBody = 
        {
          "$class": "org.acme.retail.FinanceRequest",
          "Amount": finReq.Amount,
          "financing": finReq.financing,
          "request": finReq.request,
          "retailer": finReq.retailer,
          "listing": finReq.listing

        };
        
        $http.put("http://52.87.34.178:3000/api/FinanceRequest/"+finReq.RequestID,reqBody).then((res =>{
          console.log("PUT"+res.data.request);
          showSimpleToast("Approved!");
          $scope.acceptStatus = true;
        })).catch((err =>{
          showSimpleToast("Error occured");
        }))

      }
  
      function getMyTrans(offers) {
        console.log(email);
        for(var j=0;j<offers.length;j++){
          if(offers[j].bank.localeCompare("resource:org.acme.retail.Bank#"+email)==0){
            myOffers.push(offers[j]);
          }
        }
        console.log(myOffers);
        return myOffers;
      }     
        
      // $scope.selectColor = function(tran){
        
      //     if(tran.status==="Pending"){
      //       return "yellow";
      //     }else{
      //       return "white";
      //     }
      // }

  });
