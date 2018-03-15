'use strict';

/**
 * @ngdoc function
 * @name protoApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the protoApp
 */
angular.module('protoApp')
  .controller('LoginCtrl', function ($http,AuthToken,$scope,$location,$rootScope,$window,$route) {
    $scope.credentials = {
      'email':"",
      'Password':""
    };
    $('html,body').scrollTop(0);


    var numbers = [1,2,3,4,5];       
    
    function shuffle(o) {
      var resp = "";
      for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
      for(var k=0;k<o.length;k++){
        resp = resp + o[k];
      }
      return resp;
    };

    $scope.loginCredentials = function(){
        var islogged = false;
        $http.get("http://52.87.34.178:3000/api/User").then((res=>{
            if(res.status === 200){
              for(var i=0;i<res.data.length;i++){
                if(res.data[i].email === $scope.credentials.email && res.data[i].Password === $scope.credentials.Password){
                  alert("Logged In successfully!");
                  islogged = true;
                  $window.sessionStorage.token = shuffle(numbers).toString();     
                  AuthToken.setID(res.data[i].email);                          
                  res.data[i].Password = "";
                  console.log($window.sessionStorage.token);
                  // $rootScope.$emit("LoggedIn",true);
                  $window.location.reload();                  
                  // $location.url('/');
                  break;
                }
              }
              if(!islogged){
                delete $window.sessionStorage.token;
                alert("Please check your credentials");
              }

            }
        })).catch(err =>{
          alert("Sorry something went wrong :(");
        });
    }

  });
