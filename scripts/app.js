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
      
      $mdThemingProvider.theme('default')
      .primaryPalette('brown')
      .accentPalette('red');
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
      .when('/newTrans', {
        templateUrl: 'views/newtrans.html',
        controller: 'NewtransCtrl',
        controllerAs: 'newTrans'
      })
      .when('/inventory', {
        templateUrl: 'views/inventory.html',
        controller: 'InventoryCtrl',
        controllerAs: 'inventory'
      })
      .when('/balance', {
        templateUrl: 'views/balance.html',
        controller: 'BalanceCtrl',
        controllerAs: 'balance'
      })
      .when('/pastTrans', {
        templateUrl: 'views/pasttrans.html',
        controller: 'PasttransCtrl',
        controllerAs: 'pastTrans'
      })
      .when('/verifyTrans', {
        templateUrl: 'views/verifytrans.html',
        controller: 'VerifytransCtrl',
        controllerAs: 'verifyTrans'
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
