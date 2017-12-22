'use strict';

/**
 * @ngdoc overview
 * @name protoApp
 * @description
 * # protoApp
 *
 * Main module of the application.
 */
angular.module('protoApp', [
    'ngAnimate',
    'ngMaterial',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize'
    ])
    .config(function($mdIconProvider,$mdThemingProvider){
      $mdIconProvider
      .defaultIconSet("./images/svg/avatars.svg", 128)
      .icon("menu", "./images/svg/menu.svg", 24)
      .icon("close","./images/svg/close.svg")
      .icon("share", "./images/svg/share.svg", 24);
      
      // $mdThemingProvider.theme('default')
      // .primaryPalette('brown')
      // .accentPalette('red');
      })
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/newTrans/:email', {
        templateUrl: 'views/newtrans.html',
        controller: 'NewtransCtrl',
        controllerAs: 'newTrans',
        params: {
          email: ""
        }
      })
      .when('/inventory/:email', {
        templateUrl: 'views/inventory.html',
        controller: 'InventoryCtrl',
        controllerAs: 'inventory',
        params:{
          email: ""
        }
      })
      .when('/balance/:email', {
        templateUrl: 'views/balance.html',
        controller: 'BalanceCtrl',
        controllerAs: 'balance',
        params: {
          email: ""
        }
      })
      .when('/pastTrans/:email', {
        templateUrl: 'views/pasttrans.html',
        controller: 'PasttransCtrl',
        controllerAs: 'pastTrans',
        params: {
          email: ""
        }
      })
      .when('/verifyTrans/:email', {
        templateUrl: 'views/verifytrans.html',
        controller: 'VerifytransCtrl',
        controllerAs: 'verifyTrans',
        params: {
          email: ""
        }
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl',
        controllerAs: 'login'
      })
      .when('/signup', {
        templateUrl: 'views/signup.html',
        controller: 'SignupCtrl',
        controllerAs: 'signup'
      })
      .when('/navbar', {
        templateUrl: 'views/navbar.html',
        controller: 'NavbarCtrl',
        controllerAs: 'navbar'
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
