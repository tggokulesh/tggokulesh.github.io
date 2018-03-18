'use strict';

/**
 * @ngdoc function
 * @name protoApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the protoApp
 */
angular.module('protoApp')
  .controller('MainCtrl',function ($scope,Auth,$window) {
    // $scope.onInit = function(){
    //   if(Auth.isLoggedIn()){
    //     $window.location.reload();        
    //   }
    // }

    $('html,body').scrollTop(0);

    // var scrollid = "#scrollbutton";
    // var $scrollbutton = $(scrollid);
    // $scrollbutton.hide();

    // $(function () {
    //   $(document).scroll(function () {
    //     var $nav = $('.navcontainer');
    //     $scrollbutton.show(true, $(this).scrollTop() > $nav.height());
    //     // $scrollbutton.hide(true,$(this).scrollTop() < $nav.height());
    //   });

    //   $scrollbutton.click(function() {
    //     console.log("CLICKED");
    //     $("html, body").animate({ scrollTop: 0 }, "medium");
    //     return false; 
    //   });

    // });

    
    });
