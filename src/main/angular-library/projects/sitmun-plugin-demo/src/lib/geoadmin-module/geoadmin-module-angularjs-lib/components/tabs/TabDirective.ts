import * as angular from 'angular';
var module = angular.module('ga_tab_directive', []);

  module.directive('gaTab', function() {
    return {
      restrict: 'A',
      transclude: true,
      require: '^gaTabs',
	  //define a local relative url
  	  //FIXME when creating an angular library, the resources are not processed and they should be defined inline
      //templateUrl: './partials/tab.html',
      template: '<div ng-show="active" ng-transclude></div>',
      scope: {
        title: '@gaTabTitle'
      },
      link: function(scope, elt, attrs, tabsCtrl) {
        elt.addClass('tab-pane');
        scope.active = false;
        tabsCtrl.addTab(scope);
      }
    };
  });
