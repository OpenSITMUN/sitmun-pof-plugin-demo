import * as angular from 'angular';
 
  var module = angular.module('ga_translation_directive', [
    'ga_translation_service'
  ]);

  module.directive('gaTranslationSelector', function($rootScope, gaLang) {
    var template = 
      '<a href=""' +
       ' ng-class="{\'ga-lang-selected\' : lang == l}"' +
       ' ng-click="selectLang(l)"' +
       ' ng-repeat="l in langs"' +
       ' class="hidden-xs">{{l | uppercase}}</a>' +
      '<select ng-model="lang" ng-options="l as (l | uppercase) for l in langs"' +
             ' class="visible-xs-block">' +
      '</select>';
    return {
      restrict: 'A',
      scope: {
        options: '=gaTranslationSelectorOptions'
      },
  	  //FIXME when creating an angular library, the resources are not processed and they should be defined inline
      //templateUrl: 
      /*function() {
		    //define a local relative url
        return './partials/translation.html';
      },*/
      //'./partials/translation.html',
      template: template,
      link: function(scope, element, attrs) {
        scope.lang = gaLang.get();
        scope.langs = [];
        if (scope.options && scope.options.langs) {
          scope.langs = scope.options.langs;
        }
        scope.selectLang = function(newLang) {
          scope.lang = newLang;
        };
        scope.$watch('lang', function(newLang) {
          gaLang.set(newLang);
        });
        $rootScope.$on('$translateChangeEnd', function(event, newLang) {
          if (scope.lang !== newLang.language) {
            scope.lang = newLang.language;
          }
        });
      }
    };
  });
