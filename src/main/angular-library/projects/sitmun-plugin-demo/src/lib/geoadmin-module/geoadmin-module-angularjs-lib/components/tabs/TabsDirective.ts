import * as angular from 'angular';

var module = angular.module('ga_tabs_directive', []);

  module.controller('GaTabsController', function($scope) {
    $scope.tabs = [];

    this.addTab = function(tab) {
      $scope.tabs.push(tab);

      if ($scope.tabs.length === 1) {
        tab.active = true;
      }
    };
  });

  module.directive('gaTabs', function() {
    var template = 
    '<div>' +
      '<ul class="nav nav-tabs">' +
        '<li ng-repeat="tab in tabs" ng-class="{active: tab.active}">' +
          '<a ng-click="activeTab(tab)" translate>{{::tab.title}}</a>' +
        '</li>' +
      '</ul>' +
    '</div>' +
    '<div class="tab-content">' +
      '<div ng-transclude>' +
      '</div>' +
    '</div>';

    return {
      restrict: 'A',
      transclude: true,
	  //define a local relative url
  	  //FIXME when creating an angular library, the resources are not processed and they should be defined inline
      //templateUrl: './partials/tabs.html',
      template: template,
      controller: 'GaTabsController',
      scope: {},
      link: function(scope, elt) {
        elt.addClass('tabbable');

        scope.activeTab = function(tab) {
          scope.tabs.forEach(function(t) {
            t.active = false;
          });
          tab.active = true;
        };
      }
    };
  });
