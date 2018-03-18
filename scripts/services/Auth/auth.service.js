'use strict';

angular.module('authServices',[])
.factory('Auth',function($http,AuthToken,$q,$location){
  var authfactory = [];
  var currentUser = {};

    var numbers = [1,2,3,4,5];    
    var roles = ["Bank","Retailer","Wholesaler"];
    

    function shuffle(o) {
    var resp = "";
    for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    for(var k=0;k<o.length;k++){
        resp = resp + o[k];
    }
    return resp;
    };

    authfactory.safeCb=function(cb) {
      return angular.isFunction(cb) ? cb : angular.noop;
    }

    authfactory.isLoggedIn=function(){
      if(AuthToken.getToken())
      {
        return true;
      }
      else {
        return false;
      }
    };

    authfactory.getUser=function(){
      if(AuthToken.getToken()){
        return $http.get("http://52.87.34.178:3000/api/User/"+AuthToken.getID())
        .then(res => {
            console.log("Succefully user with role"+res.data.occupation+"got");
            return res.data;
        })
      }
      else {
        return null;
      }
    };

    authfactory.postgoods = function(goods){
      for(var i=0;i<goods.length;i++){
        var current = goods[i];
        console.log(i);
        AuthToken.postgoods(current);
        // postgoods(current);
       
      } 
    }
      

    // authfactory.login = function(user, callback) {
    //     var cb = callback || angular.noop;
    //     var deferred = $q.defer();

    //     $http.post('http://shaastra.org:8000/auth/local', {
    //       email: user.email,
    //       password: user.password
    //     }).
    //     success(function (data) {
    //       $cookieStore.put('token', data.token);
    //       currentUser = User.get(function () {
    //         deferred.resolve(data);
    //         return cb();
    //       });
    //     }).
    //     error(function (err) {
    //       this.logout();
    //       deferred.reject(err);
    //       return cb(err);
    //     }.bind(this));

    //     return deferred.promise;
    //   };

    

    authfactory.createUser=function(user,callback) {
      return $http.post("http://52.87.34.178:3000/api/User",user)
      .then((res => {
        if(res.status === 200){
          console.log("Succefully user with role"+res.data.occupation+"created");
          
          AuthToken.setToken(shuffle(numbers).toString());  
          AuthToken.setID(res.data.email);        
        
          if(user.occupation === roles[0]){
            
            var bankObject = {
              "$class": "org.acme.retail.Bank",
              "email": user.email,
              "CompanyName": user.CompanyName,
              "bhash": user.CompanyName,                
            };
  
            $http.post("http://52.87.34.178:3000/api/Bank",bankObject).then((res =>{
              console.log("Bank created");
            }));              
          }else if(user.occupation === roles[1]){
  
            var retailerObject = {
              "$class": "org.acme.retail.Retailer",
              "email": user.email,
              "CompanyName": user.CompanyName,
              "Balance":user.Balance
            }
        
            $http.post("http://52.87.34.178:3000/api/Retailer",retailerObject).then((res =>{
              if(res.status === 200){
                console.log("retailer created");  
                // for(var i=0;i<goods.length;i++){
                //   var current = goods[i];
                //   AuthToken.postgoods(current);
                //   // postgoods(current);
                 
                // }                
              }

            }));
            
          }else if(user.occupation === roles[2]){
  
            var otherObject = {
              "$class": "org.acme.retail.Other",
              "email": user.email,
              "CompanyName": user.CompanyName,
              "occupation":user.occupation
            }
  
            $http.post("http://52.87.34.178:3000/api/Other",otherObject).then((res =>{
              if(res.status === 200){
                console.log("other with role"+user.occupation+"created");                  
              }         
            }));   
  
          }
          alert("Successfully created!");
          location.reload();
          $location.url('/login');
          return authfactory.safeCb(callback)(null, user);          
        }
      })).catch(err => {
        console.log('entered the error');
        alert("Email is already registered!");
        $location.url('/signup');
        return authfactory.safeCb(callback)(err);
      })
    };

    authfactory.logout=function(){
     console.log('entered the logout');
     AuthToken.setToken();
     $location.url('/login'); 
    };


  return authfactory;
})

.factory('AuthToken', function($window,$http){
  var authTokenfactory=[];

  authTokenfactory.setToken=function(token){
    if(token){
      $window.sessionStorage.token = token;
    }
    else{
      delete $window.sessionStorage.token;
    }
  };


  authTokenfactory.postgoods = function(good){  
    return $http.post("http://52.87.34.178:3000/api/Goods",good).then((res =>{
      console.log("goods created");
    })); 
  }

  authTokenfactory.setID=function(id){
    if(id){
      $window.sessionStorage.id = id;
    }
    else{
      delete $window.sessionStorage.id;
    }
  };

  authTokenfactory.getToken=function(token){
    return $window.sessionStorage.token
  };

  authTokenfactory.getID=function(id){
    return $window.sessionStorage.id
  };

  return authTokenfactory;
})

// .factory('authInterceptor', function ($rootScope, $q, $window) {
//   return {
//     request: function (config) {
//       config.headers = config.headers || {};
//       if ($window.sessionStorage.token) {
//         config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
//       }
//       return config;
//     },
//     response: function (response) {
//       if (response.status === 401) {
//         return response;
//       }
//       return response || $q.when(response);
//     }
//   };
// });
