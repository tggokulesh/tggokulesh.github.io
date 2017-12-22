'use strict';

/**
 * @ngdoc function
 * @name protoApp.controller:VerifytransCtrl
 * @description
 * # VerifytransCtrl
 * Controller of the protoApp
 */
angular.module('protoApp')
  .controller('VerifytransCtrl', function () {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    $scope.$on('isAuthenticated',function(event,data){
      if(data){
        $scope.isAuthenticated = true;
      }else{
        $location.url('/login');
      }
    });

  });
