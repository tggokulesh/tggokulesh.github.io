'use strict';

/**
 * @ngdoc function
 * @name protoApp.controller:FinancereqCtrl
 * @description
 * # FinancereqCtrl
 * Controller of the protoApp
 */
angular.module('protoApp')
  .controller('FinancereqCtrl', function ($scope,$http,$mdDialog,$mdPanel,$mdToast,$rootScope,$routeParams,$q,$location) {

      $scope.view = false;
      $scope.isreq = false;
      $scope.complete = false;
      var offers = [];
      var fin_offers = [];
      var myOffers = [];
      $scope.fin_offers = [];
      var allfinReq = [];
      var email = $routeParams.email;
      $scope.acceptStatus = false;  
      var fin_reqs = [];
      $('html,body').scrollTop(0);
            var last = {
        bottom: false,
        top: true,
        left: false,
        right:true
      };

      $scope._mdPanel = $mdPanel;
      $scope.openFrom = "button";
      $scope.closeTo = "button";
      $scope.animationType = 'scale';
      $scope.duration = 300;
      $scope.separateDurations = {
        open: $scope.duration,
        close: $scope.duration
      };
      
    $rootScope.$broadcast("init","HI");


    var position = $scope._mdPanel.newPanelPosition()
    .absolute()
    .center()
    .center();
  
    var animation = $scope._mdPanel.newPanelAnimation();
  
    animation.duration($scope.duration || $scope.separateDurations);
    animation.openFrom($scope.openFrom);    
    animation.closeTo($scope.closeTo);
    animation.withAnimation($scope._mdPanel.animation.SCALE);
    var config = {
      animation: animation,
      attachTo: angular.element(document.body),
      controller: ReviewTransCtrl,
      controllerAs: 'ctrl',
      templateUrl: 'views/allTrans.html',
      panelClass: 'demo-dialog-example',
      position: position,
      trapFocus: true,
      zIndex: 10,
      overflow: scroll, 
      clickOutsideToClose: true,
      clickEscapeToClose: true,
      disableParentScroll:true,
      hasBackdrop: true
    };
  

    $http.get("http://52.87.34.178:3000/api/FinanceRequest/").then((res =>{

                console.log(res.data);
                allfinReq = res.data;
                offers = getMyTrans(res.data);
                // for(var i=0;i<offers.length;i++){
                //   var current = offers[i];
                //   GetFinRequests(current);                
                // };

                // if(offers.length==0){
                //   $scope.isreq = true;
                // }else{
                //   $scope.isreq = false;
                // }
                if(offers.length>0){
                  $scope.isreq = false;
                }
                $scope.fin_offers = offers;
                $scope.complete = true;
                console.log($scope.fin_offers[2]);
                
              
        })
      );
      
      function getMyTrans(offers) {
        myOffers = [];
        for(var j=0;j<offers.length;j++){
          if(offers[j].bank.localeCompare("resource:org.acme.retail.Bank#"+email)==0 && offers[j].financing.localeCompare("Required")==0 && offers[j].request.localeCompare("Pending")==0){
            $scope.isreq = false;
            offers[j].retailer = offers[j].retailer.split('#')[1];
            offers[j].listing = offers[j].listing.split('#')[1];
            offers[j].bank = offers[j].bank.split('#')[1];
            myOffers.push(offers[j]);
            console.log("HEET"+myOffers.length);
          }
        }
        if(myOffers.length ==0){
          $scope.complete = true;
          $scope.isreq = true;
        }
        return myOffers;
      }     

      
      

      
     
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

      $scope.showDetails = function(ev,offer){
        selectPanel(ReviewTransCtrl,offer,'views/allTrans.html','allTrans-dialog');         
      }

      var selTrans = {};
      function selectPanel(panelCtrl,offer,panelUrl,panelclass){

        config.controller = panelCtrl;
        config.templateUrl = panelUrl;
        $scope._mdPanel.open(config);
        selTrans = offer;
        
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

      function ReviewTransCtrl(mdPanelRef,$scope,$rootScope){
        $scope._mdPanelRef = mdPanelRef;

        var offers = [];
        var myOffers = [];
        $scope.trans = [];
        var trans = [];
        var review_offer = {};
        $scope.retailer = "";
        $scope.complete = false;
        $scope.isreq = false;

          review_offer = selTrans;
          $scope.retailer = review_offer.retailer;
          console.log("Entered Review ");

         
          $http.get("http://52.87.34.178:3000/api/GoodsListing/").then( (res =>{
            if(res.status === 200){
              console.log(res.data[1]);
              offers = getMyTrans(res.data);
              for(var i=0;i<offers.length;i++){
                var current = offers[i];
                GetTransDetails(current);                
              };

              if(trans.length==0){
                $scope.isreq = true;
              }else{
                $scope.isreq = false;
              }

              $scope.trans = trans;
              console.log($scope.trans.length);
              
          }
            
      })
      )
    
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

    function getMyTrans(offers) {
      myOffers.length = 0;
      for(var j=0;j<offers.length;j++){
        if(offers[j].retailer.localeCompare("resource:org.acme.retail.Retailer#"+review_offer.retailer)==0){
          myOffers.push(offers[j]);
          console.log("GEFE")
        }
      }
      if(myOffers.length ==0){
        $scope.isreq = true;
      }else{
        $scope.isreq = false;
      }
      return myOffers;
    }
  
      function GetTransDetails(offer){
          console.log("GIT");
          allfinReq.length = 0;
          $http.get("http://52.87.34.178:3000/api/FinanceRequest/").then((res =>{

                console.log(res.data);
                allfinReq = res.data;
               
          var fin_det = [];
          var financing = "Not_required";
          var request = "NA";
          fin_det = GetFinRequests(offer);
          financing = fin_det[0];
          request = fin_det[1];
          var txn_status = offer.state1;
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
            $scope.complete  =true; 
              if(trans.length==0){
              $scope.isreq = true;
            }else{
              $scope.isreq = false;
            }}));
        })
      );
        
          
        }
      
        
        $scope.approveRequest = function(status){
          var finTrans = {
            "$class": "org.acme.retail.Finance_Trans_Accept",
            "request": "resource:org.acme.retail.FinanceRequest#"+review_offer.RequestID,
            "retailer": "resource:org.acme.retail.Retailer#"+review_offer.retailer,
            "bank": "resource:org.acme.retail.Bank#"+email,
            "transactionId":"",
            "timestamp": Date.now()
          };

          if(status){
            $http.post('http://52.87.34.178:3000/api/Finance_Trans_Accept/',finTrans).then((res =>{
              $scope._mdPanelRef && $scope._mdPanelRef.close();  
              showDialog("Successfully accepted the request");
              
            }))
          
          }else{
            finTrans.$class = "org.acme.retail.Finance_Trans_Reject";
            $http.post('http://52.87.34.178:3000/api/Finance_Trans_Reject/',finTrans).then((res =>{
              $scope._mdPanelRef && $scope._mdPanelRef.close();  
              showDialog("Rejected the request");
            }))
          }
          }

      }

      $scope.showConfirm = function(ev,fin_offer) {
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.confirm()
              .title('Would you like to provide financing?')
              .textContent('Accept to provide financing to the retailer!')
              .ariaLabel('Lucky day')
              .targetEvent(ev)
              .ok('Accept')
              .cancel('Reject');
    
        $mdDialog.show(confirm).then(function() {
          approveRequest(fin_offer);
        }, function() {
          showSimpleToast("Cancelled!");
        });
      };


      
  
      
        
      // $scope.selectColor = function(tran){
        
      //     if(tran.status==="Pending"){
      //       return "yellow";
      //     }else{
      //       return "white";
      //     }
      // }

  });
