'use strict';

/**
 * @ngdoc function
 * @name protoApp.controller:NavbarCtrl
 * @description
 * # NavbarCtrl
 * Controller of the protoApp
 */
angular.module('protoApp')
  .controller('NavbarCtrl',function ($scope, $window,$location, Auth, $timeout, $mdSidenav, $q,$log,$mdComponentRegistry,$rootScope) {
    $scope.toggleLeft = buildDelayedToggler('left');
    $mdComponentRegistry.when('left').then(function() {
      // Now you can use $mdSidenav('left') or $mdSidenav('left', true) without getting an error.
      $scope.isOpen = $mdSidenav('left').isOpen();
    })
    
    var roles = ["Bank","Retailer","Wholesaler"];
    $scope.isAuthenticated = Auth.isLoggedIn();
    console.log($scope.isAuthenticated+"AUTHENT");
    
    $scope.isBank = false;
    $scope.isRetailer = false;
    $scope.isWholesaler = false; 
    $scope.user = {};

    // $scope.$on("LoggedIn",function(event,data){
    //   if(data){
    //     $window.location.reload();
    //   }
    // });

    if($scope.isAuthenticated){
      Auth.getUser().then(function(data){
        console.log("ENTERDE GET USER");
        $scope.user = data;
        if($scope.user!=null){
          if($scope.user.occupation===roles[0])
            $scope.isBank = true;
          else if($scope.user.occupation === roles[1])
            $scope.isRetailer = true;
          else if($scope.user.occupation === roles[2])
            $scope.isWholesaler = true;    
        }
      });
    }
    
    $scope.logout = function(){
      Auth.logout();
      $window.location.reload();
    }

    /**
     * Supplies a function that will continue to operate until the
     * time is up.
     */
    function debounce(func, wait, context) {
      var timer;

      return function debounced() {
        var context = $scope,
            args = Array.prototype.slice.call(arguments);
        $timeout.cancel(timer);
        timer = $timeout(function() {
          timer = undefined;
          func.apply(context, args);
        }, wait || 10);
      };
    }

    /**
     * Build handler to open/close a SideNav; when animation finishes
     * report completion in console
     */
    function buildDelayedToggler(navID) {
      return debounce(function() {
        // Component lookup should always be available since we are not using `ng-if`
        $mdSidenav(navID)
          .toggle()
          .then(function () {
            $log.debug("toggle " + navID + " is done");
          });
      }, 200);
    }

    function buildToggler(navID) {
      return function() {
        // Component lookup should always be available since we are not using `ng-if`
        $mdSidenav(navID)
          .toggle()
          .then(function () {
            $log.debug("toggle " + navID + " is done");
          });
      };
    }

    var mouse_is_inside = false;
    
    $(document).ready(function()
    {
        $('#nav1').hover(function(){
            mouse_is_inside=true;
        }, function(){
            mouse_is_inside=false;
        });
    
        $("body").mouseup(function(){
            if(! mouse_is_inside) $scope.close();
        });
    });

    $scope.close = function () {
      console.log("ENTERED")
      // Component lookup should always be available since we are not using `ng-if`
      $mdSidenav('left').close()
        .then(function () {
          $scope.isOpen = false;          
          $log.debug("close LEFT is done");
          console.log($scope.isOpen);
        });

    };

    $scope.status = function(){
      return $scope.isOpen;
    };
    
    $scope.open= function () {
      console.log("ENTERD");
      // Component lookup should always be available since we are not using `ng-if`
      $mdSidenav('left').open()
        .then(function () {
          $scope.isOpen = true;          
          $log.debug("open LEFT is done");
          console.log($scope.isOpen);          
        });

    };
  });
