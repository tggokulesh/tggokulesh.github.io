'use strict';

/**
 * @ngdoc function
 * @name protoApp.controller:NewtransCtrl
 * @description
 * # NewtransCtrl
 * Controller of the protoApp
 */
angular.module('protoApp')
  .controller('NewtransCtrl', function ($location,$mdDialog,$scope,$http,$mdPanel,$mdToast,$rootScope,$routeParams) {
    $scope._mdPanel = $mdPanel;
    $scope.openFrom = "button";
    $scope.closeTo = "button";
    $scope.animationType = 'scale';
    $scope.duration = 300;
    $scope.separateDurations = {
      open: $scope.duration,
      close: $scope.duration
    };
    $('html,body').scrollTop(0);

    $scope.submit = true;

    var email = $routeParams.email;
    var goodObject = {
      "$class": "org.acme.retail.Goods",
      "GoodsID": "",
      "Description": "",
      "rinventory": 0,
      "retailer":''
    };

    var goodsListObject = {
      "$class": "org.acme.retail.GoodsListing",
      "ListingID": "",  
      "quantity": 0,
      "Price": 0,
      "state": "Buying",
      "ostate": "Other",
      "state1": "Pending",
      "goods": "",
      "other": "",
      "retailer":"",
      "bank":""
    };

    var participantObject = {
      "email": "",
    }

    var bankObject = {
      "email": "",
    };

    // var TransactionObject = {
    //   "$class": "org.acme.retail.Offer",
    //   "listing": "",
    //   "other": "",
    //   "retailer": "",
    //   "bank": "",
    //   "transactionId": "",
    //   "timestamp": ""
    // };

    var financeReq = {
      "$class": "org.acme.retail.FinanceRequest",
      "RequestID": "",
      "Amount": 0,
      "financing": "Not_required",
      "request": "Pending",
      "retailer": "",
      "listing": ""
    };

    // var Finance_Trans = {
    //   "$class": "org.acme.retail.Finance_Trans",
    //   "request": "",
    //   "retailer": "",
    //   "bank": "",
    //   "transactionId": "",
    //   "timestamp": ""
    // }

    var isStep1 = false;
    var isStep2 = false;
    var isStep3 = false;
    var isStep4 = false;
    var isStep5 = false;
    
    var last = {
      bottom: false,
      top: true,
      left: false,
      right: true
    };

    $scope.Step1 = "step 1";
    $scope.Step2 = "step 2";
    $scope.Step3 = "step 3";
    $scope.Step4 = "step 4";
    $scope.Step5 = "step 5";

    $('#finance').hide();
    
    function StatusTrans(state){
      $scope.submit = state;
    }

    function stepStatus(step,message){
      switch(step){
        case 'Step1': $scope.Step1 = message;break;
        case 'Step2': $scope.Step2 = message;break;
        case 'Step3': $scope.Step3 = message;break;
        case 'Step4': $scope.Step4 = message;break;
        case 'Step5': $scope.Step5 = message;break;
        
        }
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
      controller: GoodsCtrl,
      controllerAs: 'ctrl',
      templateUrl: 'views/goodsPanel.html',
      panelClass: 'demo-dialog-example',
      position: position,
      trapFocus: true,
      zIndex: 10,
      clickOutsideToClose: true,
      clickEscapeToClose: true,
      disableParentScroll:true,
      hasBackdrop: true
    };
  
    var alert;
    
    var numbers = [1,2,3,4,5];       
    
    function shuffle(o) {
      var resp = "";
      for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
      for(var k=0;k<o.length;k++){
        resp = resp + o[k];
      }
      return resp;
    };

    $scope.demo = {
      showTooltip : false,
      tipDirection : 'top'
    };

    $scope.selectGoods = function() {
      selectPanel(GoodsCtrl,'views/goodsPanel.html','goods-dialog');      
    };

    $scope.decideQuantity = function() {
      selectPanel(QuantityCtrl,'views/decidequantity.html','quanitity-dialog');            
    };

    $scope.selectPartici = function() {
      selectPanel(ParticipantCtrl,'views/chooseparticipant.html','partici-dialog');            
    };

    $scope.selectBank = function() {
      selectPanel(BankCtrl,'views/choosebank.html','bank-dialog');            
    }; 

    $scope.financeRequest = function() {
      selectPanel(FinanceCtrl,'views/financeRequest.html','finance-dialog');            
    }; 
       
    function showfinance(){
      $scope.financeRequest();
    }

    // $scope.submitTrans = function(){
    //   if(isStep1 && isStep2 && isStep3 && isStep4 && isStep5){
    //     TransactionObject.goods = "resource:org.acme.retail.Goods#"+goodObject.GoodsID;
    //     TransactionObject.listing = "resource:org.acme.retail.GoodsListing#"+goodsListObject.ListingID;
    //     TransactionObject.other = "resource:org.acme.retail.Other#"+participantObject.email;
    //     TransactionObject.bank = "resource:org.acme.retail.Bank#"+bankObject.email;
    //     TransactionObject.retailer = "resource:org.acme.retail.Retailer#"+goodObject.retailer;
    //     TransactionObject.timestamp = Date.now();

    //     $http.post("http://52.87.34.178:3000/api/Offer",TransactionObject).then((res)=>{
    //       if(res.status===200){
    //         $scope.submit = true;
    //         showSimpleToast("Order Placed successfully");
    //         location.reload();
    //       }
    //   });
    //   }else{
    //     alert("Please complete above Steps to submit the Transaction");
    //   }
    // };

    function selectPanel(panelCtrl,panelUrl,panelclass){

      config.controller = panelCtrl;
      config.templateUrl = panelUrl;
      $scope._mdPanel.open(config);
      
    }

      function GoodsCtrl(mdPanelRef,$scope,$rootScope){
        $scope._mdPanelRef = mdPanelRef;
        
        $scope.addGoods = function() {
          goodObject.GoodsID = shuffle(numbers).toString();
          goodObject.Description = $scope.description;
          goodObject.retailer = email;
          $http.post("http://52.87.34.178:3000/api/Goods",goodObject).then((res)=>{
              if(res.status===200){
                isStep1 = true;
                stepStatus('Step1',"step 1 completed!");
                showSimpleToast("Step 1 completed!");
              }
              $scope._mdPanelRef && $scope._mdPanelRef.close();  
            });
            
        }; 
      }

      

      function ParticipantCtrl(mdPanelRef,$scope){
        $scope._mdPanelRef = mdPanelRef;
        $scope.others = [];
        $http.get("http://52.87.34.178:3000/api/Other").then((res =>{
          if(res.status === 200){
            $scope.others = res.data;
          }
        }));

        $scope.addParticipant = function() {
          if(isStep1){

            participantObject.email = $scope.email;
            isStep2 = true;
            stepStatus('Step2',"step 2 completed!");
            showSimpleToast("Step 2 completed!");
            $scope._mdPanelRef && $scope._mdPanelRef.close(); 

          }else{
            alert("Please complete Step 1 first");            
          }
          
        }; 
      }

      function BankCtrl(mdPanelRef,$scope){
        $scope._mdPanelRef = mdPanelRef;
        $scope.banks = [];
        $http.get("http://52.87.34.178:3000/api/Bank").then((res =>{
          if(res.status === 200){
            $scope.banks = res.data;
          }
        }));

        $scope.addBank = function() {
          if(isStep1 && isStep2){
            bankObject.email = $scope.email;
            
            isStep3 = true;
            stepStatus('Step3',"step 3 completed!");
            showSimpleToast("Step 3 completed!");
            
            $scope._mdPanelRef && $scope._mdPanelRef.close(); 
          }else{
            alert("Please complete Step 1 and 2");
          }
        }; 
      }

      function QuantityCtrl(mdPanelRef,$scope,$rootScope){
        $scope._mdPanelRef = mdPanelRef;
        
        $scope.addQuantity = function() {
          if(isStep1 && isStep2 && isStep3){
            goodsListObject.goods = "resource:org.acme.retail.Goods#"+goodObject.GoodsID;
            goodsListObject.state1 = "Pending";
            goodsListObject.ListingID = shuffle(numbers).toString();
            goodsListObject.quantity = $scope.quantity;
            goodsListObject.state = $scope.state;
            goodsListObject.Price = $scope.price;
            goodsListObject.other =  "resource:org.acme.retail.Other#"+participantObject.email;
            goodsListObject.retailer = "resource:org.acme.retail.Retailer#"+goodObject.retailer;
            goodsListObject.bank = "resource:org.acme.retail.Bank#"+bankObject.email;

            console.log("GOODSIDAPPENDED");
            
            $http.post("http://52.87.34.178:3000/api/GoodsListing",goodsListObject).then((res)=>{
                if(res.status===200){
                  isStep4 = true;
                  stepStatus('Step4',"step 4 completed!");                  
                  showSimpleToast("Step 4 completed!");
                  if(goodsListObject.state==="Buying"){
                    $('#finance').show();            
                  }else{
                    $scope.submit = true;
                    showDialog("Order Placed successfully");
                  }
                }

                $scope._mdPanelRef && $scope._mdPanelRef.close();            
            });
          }else{
            alert("Please complete Step 1,2 and 3 first!");            
          }
        }; 
      }

      
      function showDialog(message) {

          alert = $mdDialog.alert({
            title: 'Congrats',
            textContent: message+'!',
            ok: 'Close'
          });

          $mdDialog
            .show( alert )
            .finally(function() {
              alert = undefined;
              location.reload();               

            });
      }


      function FinanceCtrl(mdPanelRef,$scope){
        $scope._mdPanelRef = mdPanelRef;
        
        $scope.addfinance = function() {
          console.log("ENTERED FINANCE");
          if(isStep1 && isStep2 && isStep3 && isStep4){
            financeReq.RequestID = shuffle(numbers).toString();
            financeReq.financing = $scope.financing;
            if($scope.financing=="Not_required"){
              financeReq.Amount = 0;
            }else{
              financeReq.Amount = goodsListObject.quantity*goodsListObject.Price;      
              financeReq.request = "Pending";        
            }
            financeReq.retailer = goodsListObject.retailer;
            financeReq.listing = "resource:org.acme.retail.GoodsListing#"+goodsListObject.ListingID;
            $http.post("http://52.87.34.178:3000/api/FinanceRequest",financeReq).then((res =>{
                if(res.status === 200){

                  // if(financeReq.financing=="Need"){
                  //   Finance_Trans.request = "resource:"+financeReq.$class+"#"+financeReq.RequestID;
                  //   Finance_Trans.bank = bankObject.email;
                  //   Finance_Trans.retailer = email;
                  //   Finance_Trans.timestamp = Date.now();
                  //   $http.post("http://52.87.34.178:3000/api/Finance_Trans",Finance_Trans).then((res=>{
                  //     isStep5 = true;
                  //     stepStatus('Step5',"step 5 completed!");                  
                  //     showSimpleToast("Step 5 completed!");
                  //     StatusTrans(false);                                   
                  //     $scope._mdPanelRef && $scope._mdPanelRef.close();  
                  //   }))
                  // }else{
                  isStep5 = true;
                  stepStatus('Step5',"step 5 completed!");   
                  $scope.submit = true;
                  $scope._mdPanelRef && $scope._mdPanelRef.close(); 
                  showDialog("Order Placed successfully");
                  StatusTrans(true);                                   

                }
            }));
                
          }else{
            alert("Please complete Step 1,2,3 and 4 first!");            
          }
        }; 
      }

    });
