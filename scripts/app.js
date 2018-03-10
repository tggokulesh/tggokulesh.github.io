'use strict';

/**
 * @ngdoc overview
 * @name protoApp
 * @description
 * # protoApp
 *
 * Main module of the application.
 */
var app = angular.module('protoApp', [
    'ngAnimate',
    'ngMaterial',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'authServices',
    'ui.bootstrap'
    ])
    .config(function($mdIconProvider,$mdThemingProvider){
      $mdIconProvider
      .defaultIconSet("./images/svg/avatars.svg", 128)
      .icon("menu", "./images/svg/menu.svg", 24)
      .icon("logo1", "./images/svg/block2.svg", 48)
      .icon("logo2", "./images/svg/blockchain.svg", 24)
      .icon("logo3", "./images/svg/world.svg", 128)


      .icon("close","./images/svg/close.svg")
      .icon("share", "./images/svg/share.svg", 24)
      .icon("right","./images/svg/arrow_right.svg",24)
      .icon("done","./images/svg/done.svg",48);
      // .icon("slide1","./images/",48);
      // .icon("slide2","./images/",48);
      // .icon("slide3","./images/",48);

      // $mdThemingProvider.theme('default')
      // .primaryPalette('brown')
      // .accentPalette('red');
      })
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main',
      })
      .when('/profile/:email', {
        templateUrl: 'views/profile.html',
        controller: 'ProfileCtrl',
        controllerAs: 'profile',
        params:{
          email: ""
        },
        authenticated:true
      })
      .when('/newTrans/:email', {
        templateUrl: 'views/newtrans.html',
        controller: 'NewtransCtrl',
        controllerAs: 'newTrans',
        params: {
          email: ""
        },
        authenticated:true
      })
      .when('/inventory/:email', {
        templateUrl: 'views/inventory.html',
        controller: 'InventoryCtrl',
        controllerAs: 'inventory',
        params:{
          email: ""
        },
        authenticated:true
      })
      .when('/balance/:email', {
        templateUrl: 'views/balance.html',
        controller: 'BalanceCtrl',
        controllerAs: 'balance',
        params: {
          email: ""
        },
        authenticated:true
      })
      .when('/pastTrans/:email', {
        templateUrl: 'views/pasttrans.html',
        controller: 'PasttransCtrl',
        controllerAs: 'pastTrans',
        params: {
          email: ""
        },
        authenticated:true
      })
      .when('/verifyTrans/:email', {
        templateUrl: 'views/verifytrans.html',
        controller: 'VerifytransCtrl',
        controllerAs: 'verifyTrans',
        params: {
          email: ""
        },
        authenticated:true
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl',
        controllerAs: 'login',
        authenticated:false
      })
      .when('/signup', {
        templateUrl: 'views/signup.html',
        controller: 'SignupCtrl',
        controllerAs: 'signup',
        authenticated:false
      })
      .when('/navbar', {
        templateUrl: 'views/navbar.html',
        controller: 'NavbarCtrl',
        controllerAs: 'navbar'
      })
      .when('/transReq/:email', {
        templateUrl: 'views/transreq.html',
        controller: 'TransreqCtrl',
        controllerAs: 'transReq',
        params: {
          email: ""
        },
        authenticated:true
      })
      .when('/financeReq/:email', {
        templateUrl: 'views/financereq.html',
        controller: 'FinancereqCtrl',
        controllerAs: 'financeReq',
        params: {
          email: ""
        },
        authenticated:true
      })
      .when('/bankVerifyReq/:email', {
        templateUrl: 'views/bankverifyreq.html',
        controller: 'BankverifyreqCtrl',
        controllerAs: 'bankVerifyReq',
        params: {
          email: ""
        },
        authenticated:true
      })
      .when('/logout', {
        templateUrl: 'views/logout.html',
        controller: 'LogoutCtrl',
        controllerAs: 'logout',
        authenticated:true
      })
      .otherwise({
        redirectTo: '/'
      })
      
  }).directive("navBar", function() {
    return {
        restrict:'A',
        templateUrl : 'views/navbar.html',
        controller:'NavbarCtrl',
        controllerAs:'navbar'
    }
    });

    app.run(['$rootScope', 'Auth', '$location',function($rootScope,Auth,$location){
      
          'ngInject';
      
        $rootScope.$on('$routeChangeStart',function(event,next,current){
      
          if(next.$$route !== undefined){
            if(next.$$route.authenticated === true){
              if(!Auth.isLoggedIn()){
                event.preventDefault();
                $location.path('/login');
              }
            }
            else if(next.$$route.authenticated === false){
              if(Auth.isLoggedIn()){
                event.preventDefault();
                $location.path('/');
              }
            }
          }
        });
      }]);
