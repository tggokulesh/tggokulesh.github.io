'use strict';

/**
 * @ngdoc function
 * @name protoApp.controller:NewtransCtrl
 * @description
 * # NewtransCtrl
 * Controller of the protoApp
 */
angular.module('protoApp')
  .controller('NewtransCtrl', function ($scope,$http,$mdPanel,$controller,$rootScope) {
    $scope._mdPanel = $mdPanel;
    $scope.openFrom = "button";
    $scope.closeTo = "button";
    $scope.animationType = 'scale';
    $scope.duration = 300;
    $scope.separateDurations = {
      open: $scope.duration,
      close: $scope.duration
    };
    $scope.submit = true;
    
    var goodObject = {
      "$class": "org.acme.retail.Goods",
      "GoodsID": "",
      "Description": "",
      "rinventory": 0,
      "ostate": "Other",
      "retailer":'ram@1.com'
    };

    var goodsListObject = {
      "$class": "org.acme.retail.GoodsListing",
      "ListingID": "",
      "rhash": "",
      "quantity": 0,
      "Price": 0,
      "state": "Buying",
      "ostate": "Other",
      "state1": "Pending",
      "goods": "",
      "other": "resource:org.acme.retail.Other#",
      "retailer":""
    };

    var participantObject = {
      "$class": "org.acme.retail.Other",
      "email": "",
      "CompanyName": ""
    }

    var bankObject = {
      "$class": "org.acme.retail.Bank",
      "bhash": "",
      "email": "",
      "CompanyName": ""
    };

    var TransactionObject = {
      "$class": "org.acme.retail.Offer",
      "listing": "",
      "other": "",
      "retailer": "",
      "bank": "",
      "transactionId": "",
      "timestamp": ""
    };

    var isStep1 = false;
    var isStep2 = false;
    var isStep3 = false;
    var isStep4 = false;

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
      zIndex: 150,
      clickOutsideToClose: true,
      clickEscapeToClose: true,
      hasBackdrop: true,
    };
  
    var numbers = [1,2,3,4,5,6,7,8,9,10];       
    
    function shuffle(o) {
      for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
      return o;
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
          goodObject.rinventory = $scope.inventory;
          $http.post("http://52.87.34.178:3000/api/Goods",goodObject).then((res)=>{
              if(res.status===200){
                isStep1 = true;
                alert("Successfully done");
              }
              $scope._mdPanelRef && $scope._mdPanelRef.close();  
            });
            
        }; 
      }

      function QuantityCtrl(mdPanelRef,$scope,$rootScope){
        $scope._mdPanelRef = mdPanelRef;
      
        $scope.addQuantity = function() {
          if(isStep1){
            goodsListObject.goods = "resource:org.acme.retail.Goods#"+goodObject.GoodsID;
            goodsListObject.state1 = "Accepted";
            goodsListObject.ListingID = shuffle(numbers).toString();
            goodsListObject.rhash = $scope.rhash;
            goodsListObject.quantity = $scope.quantity;
            goodsListObject.state = $scope.state;
            goodsListObject.Price = $scope.price;
            goodsListObject.retailer = "resource:org.acme.retail.Retailer#"+goodObject.retailer;
            console.log("GOODSIDAPPENDED");
            
            $http.post("http://52.87.34.178:3000/api/GoodsListing",goodsListObject).then((res)=>{
                if(res.status===200){
                  isStep2 = true;
                  alert("Successfully done");
                }
                $scope._mdPanelRef && $scope._mdPanelRef.close();            
            });
          }else{
            alert("Please complete Step 1 first");
          }
        }; 
      }

      function ParticipantCtrl(mdPanelRef,$scope){
        $scope._mdPanelRef = mdPanelRef;
        
        $scope.addParticipant = function() {
          if(isStep1 && isStep2){

            participantObject.email = $scope.email;
            participantObject.CompanyName = $scope.CompanyName;
            
            $http.post("http://52.87.34.178:3000/api/Other",participantObject).then((res)=>{
                if(res.status===200){
                  isStep3 = true;
                  alert("Successfully done");
                }
                $scope._mdPanelRef && $scope._mdPanelRef.close();            
            });
              
          }else{
            alert("Please complete Step 1 and 2");
          }
          
        }; 
      }

      function BankCtrl(mdPanelRef,$scope){
        $scope._mdPanelRef = mdPanelRef;
        
        $scope.addBank = function() {
          if(isStep1 && isStep2 && isStep3){
            bankObject.email = $scope.email;
            bankObject.CompanyName = $scope.CompanyName;
            
            $http.post("http://52.87.34.178:3000/api/Bank",bankObject).then((res)=>{
                if(res.status===200){
                  isStep4 = true;
                  alert("Successfully done");
                }
                $scope._mdPanelRef && $scope._mdPanelRef.close();            
            });
          }else{
            alert("Please complete Step 1,2 and 3 first!");            
          }
        }; 
      }

      $scope.newTrans = function(){
        if(isStep1 && isStep2 && isStep3 && isStep4){
          $scope.submit = false;
          TransactionObject.goods = "resource:org.acme.retail.Goods#"+goodObject.GoodsID;
          TransactionObject.other = "resource:org.acme.retail.Other#"+participantObject.email;
          TransactionObject.retailer = "resource:org.acme.retail.Retailer#"+goodObject.retailer;
          TransactionObject.transactionId = shuffle(numbers);
          TransactionObject.timestamp = Date.now();

          $http.post("http://52.87.34.178:3000/api/Offer",TransactionObject).then((res)=>{
            if(res.status===200){
              $scope.submit = true;
              alert("Transaction successfully done");
            }
        });
        }else{
          alert("Please complete above Steps to submit the Transaction");
        }
      }

    });
