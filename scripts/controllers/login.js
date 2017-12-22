'use strict';

/**
 * @ngdoc function
 * @name protoApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the protoApp
 */
angular.module('protoApp')
  .controller('LoginCtrl', function ($http,$scope,$location,$rootScope) {
    $scope.credentials = {
      'email':"",
      'Password':""
    };

    $scope.loginCredentials = function(){
        $http.get("http://52.87.34.178:3000/api/User").then((res=>{
            if(res.status === 200){
              for(var i=0;i<res.data.length;i++){
                if(res.data[i].email === $scope.credentials.email && res.data[i].Password === $scope.credentials.Password){
                  alert("Logged In successfully!");
                  res.data[i].Password = "";
                  $location.url('/');
                  $rootScope.$broadcast("isAuthenticated",true);
                  $rootScope.$emit("user",res.data[i]);
                }
              }
            }
        }))
    }
  });
