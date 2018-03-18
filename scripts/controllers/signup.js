
'use strict';

/**
 * @ngdoc function
 * @name protoApp.controller:SignupCtrl
 * @description
 * # SignupCtrl
 * Controller of the protoApp
 */
angular.module('protoApp')
  .directive('passwordVerify',function passwordVerify () {
    return {
        restrict: 'A', // only activate on element attribute
        require: '?ngModel', // get a hold of NgModelController
        link: function(scope, elem, attrs, ngModel) {
          if (!ngModel) return; // do nothing if no ng-model

          // watch own value and re-validate on change
          scope.$watch(attrs.ngModel, function() {
            validate();
          });

          // observe the other value and re-validate on change
          attrs.$observe('passwordVerify', function(val) {
            validate();
          });

          var validate = function() {
            // values
            var val1 = ngModel.$viewValue;
            var val2 = attrs.passwordVerify;
            // set validity
            ngModel.$setValidity('passwordVerify', val1 === val2);
          };
        }
    }
})
.controller('SignupCtrl', function ($http,Auth,$scope,$location) {
  $('html,body').scrollTop(0);  
  $scope.deactivate = true;
  $scope.user = {};
  var roles = ["Bank","Retailer","Wholesaler"];
  $('html,body').scrollTop(0);

    $scope.goods = [];

    var numbers = [1,2,3,4,5,6,7,8];       

    // $scope.action = false;
    function shuffle(o) {
      var resp = "";
      for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
      for(var k=0;k<o.length;k++){
        resp = resp + o[k];
      }
      return resp;
    };

    

    $scope.addgoods = function (good) {
      var good = {
        "$class": "org.acme.retail.Goods",
        "GoodsID": "",
        "Description": "",
        "rinventory": "",
        "retailer": "",
        "action":false
      }

      good.GoodsID =  shuffle(numbers).toString();
      good.retailer = "resource:org.acme.retail.Retailer#"+$scope.user.email;
      $scope.goods.push(good);
      changeStatus(good,false);
    };

    $scope.removegood = function(z){
      // changeStatus(good,true);
      $scope.goods.splice(z,1);
    }

    function changeStatus(good,state){
      for(var i =0;i<$scope.goods.length;i++){
        if($scope.goods[i].GoodsID===good.GoodsID){
          $scope.goods[i].action = state;
        }
      }
    }


    $scope.confirmgood = function(good){
      for(var i =0;i<$scope.goods.length;i++){
        if($scope.goods[i].GoodsID===good.GoodsID){
          $scope.goods[i].rinventory = good.rinventory;
          $scope.goods[i].Description = good.Description;
          $scope.goods[i].action = true;
        }
      }
    }


    $scope.createUser=function(){
        
    $scope.user = $scope.user;
    // $scope.goods = $scope.goods;

    if($scope.user.occupation!=roles[1]){
      $scope.user.Balance = 0;
      $scope.goods.length = 0;
    }
    if($scope.user.occupation ==="Retailer"){
      console.log("DDDD");
      Auth.postgoods($scope.goods);
    }

    Auth.createUser($scope.user); 
    delete $scope.user.confirm_password;

    // $http.post("http://52.87.34.178:3000/api/User",$scope.user).then((res => {
    //   if(res.status === 200){
    //     console.log("Succefully user with role"+res.data.occupation+"created");
    //     if($scope.user.occupation === roles[0]){
          
    //       var bankObject = {
    //         "$class": "org.acme.retail.Bank",
    //         "email": $scope.user.email,
    //         "CompanyName": $scope.user.CompanyName,
    //         "bhash": $scope.user.CompanyName,                
    //       };

    //       $http.post("http://52.87.34.178:3000/api/Bank",bankObject).then((res =>{
    //         console.log("Bank created");
    //       }));              
    //     }else if($scope.user.occupation === roles[1]){

    //       var retailerObject = {
    //         "$class": "org.acme.retail.Retailer",
    //         "email": $scope.user.email,
    //         "CompanyName": $scope.user.CompanyName,
    //         "Balance":$scope.user.Balance
    //       }
      
    //       $http.post("http://52.87.34.178:3000/api/Retailer",retailerObject).then((res =>{
    //         if(res.status === 200){
    //           console.log("retailer created");                  
    //         }
    //       }));
          
    //     }else if($scope.user.occupation === roles[2]){

    //       var otherObject = {
    //         "$class": "org.acme.retail.Other",
    //         "email": $scope.user.email,
    //         "CompanyName": $scope.user.CompanyName,
    //         "occupation":$scope.user.occupation
    //       }

    //       $http.post("http://52.87.34.178:3000/api/Other",otherObject).then((res =>{
    //         if(res.status === 200){
    //           console.log("other with role"+$scope.user.occupation+"created");                  
    //         }         
    //       }));   

    //     }
    //     alert("Successfully created!");
    //     $location.url('/login');
    //   }
    // })).catch(err => {
    //   console.log('entered the error');
    //   alert("Email is already registered!");
    //   $location.url('/signup');
    // })
      };

});
