'use strict';

/**
 * @ngdoc function
 * @name protoApp.controller:BankverifyreqCtrl
 * @description
 * # BankverifyreqCtrl
 * Controller of the protoApp
 */
angular.module('protoApp')
  .controller('BankverifyreqCtrl', function ($scope,$http,$mdPanel,Auth,$routeParams) {
    var offers = [];
    var myOffers = [];
    $scope.trans = [];
    var trans = [];
    var email = $routeParams.email;
    $scope._mdPanel = $mdPanel;
    $scope.openFrom = "button";
    $scope.closeTo = "button";
    $scope.animationType = 'scale';
    $scope.duration = 300;
    $scope.separateDurations = {
      open: $scope.duration,
      close: $scope.duration
    };
    var rhash;
    $scope.verificationStatus = false;
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
      controller: VerifyCtrl,
      controllerAs: 'ctrl',
      templateUrl: 'views/verifypanel.html',
      panelClass: 'demo-dialog-example',
      position: position,
      trapFocus: true,
      zIndex: 80,
      clickOutsideToClose: true,
      clickEscapeToClose: true,
      hasBackdrop: true,
    };

    function status(data){
      $scope.verificationStatus = data;
    }

    function VerifyCtrl(mdPanelRef,$scope,$rootScope){
      $scope._mdPanelRef = mdPanelRef;
      $scope.bhash = "";
      $scope.error_message = "";      
      $scope.addBhash = function() {
        if($scope.bhash === rhash){
          alert('Verified Successfully');
          status(true);
          $scope._mdPanelRef && $scope._mdPanelRef.close();  
          
        }else{
          alert("Entered hash does not match!"); 
          status(false);         
        }          
      }; 
    }

    function getMyTrans(offers) {
      for(var j=0;j<offers.length;j++){
        if(offers[j].bank.localeCompare("resource:org.acme.retail.Bank#"+email)==0){
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
        'rhash':res.data.rhash,
        'time':offer.timestamp
        };
        rhash = tran.rhash;
        trans.push(tran);          
        
        // console.log(tran);
  }))
    }    

    $scope.verify = function(tran){
        $scope._mdPanel.open(config);                
    }
  });
