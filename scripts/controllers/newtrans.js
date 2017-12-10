'use strict';

/**
 * @ngdoc function
 * @name protoApp.controller:NewtransCtrl
 * @description
 * # NewtransCtrl
 * Controller of the protoApp
 */
angular.module('protoApp')
  .controller('NewtransCtrl', function ($scope,$http,$mdPanel,$controller) {
    $scope._mdPanel = $mdPanel;
    $scope.openFrom = 'button';
    $scope.closeTo = 'button';
    $scope.animationType = 'scale';
    $scope.duration = 300;
    $scope.separateDurations = {
      open: $scope.duration,
      close: $scope.duration
    };

    $scope.selectGoods = function() {
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
            controller: DialogCtrl,
            controllerAs: 'ctrl',
            templateUrl: 'views/selectPanel.html',
            panelClass: 'demo-dialog-example',
            position: position,
            trapFocus: true,
            zIndex: 150,
            clickOutsideToClose: true,
            clickEscapeToClose: true,
            hasBackdrop: true,
          };
        
          $scope._mdPanel.open(config);
        };
        
      function DialogCtrl(mdPanelRef,$scope){
        $scope._mdPanelRef = mdPanelRef;
        var goodObject = {
          "$class": "org.acme.retail.Goods",
          "GoodsID": "",
          "Description": "",
          "rinventory": 0,
          "ostate": "Other"
        };

        $scope.name = "";
        $scope.inventory = 0;
        $scope.description = "";

        $scope.addGoods = function() {
          goodObject.GoodsID = $scope.name;
          goodObject.Description = $scope.description;
          goodObject.rinventory = $scope.inventory;
          $http.post("http://52.87.34.178:3000/api/Goods",goodObject).then((res)=>{
              if(res.status===200){
                alert("Successfully done");
              }
              $scope._mdPanelRef && $scope._mdPanelRef.close();            
          });
            
      }; 
         }

      
      
    });
