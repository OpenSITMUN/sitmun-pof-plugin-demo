//goog.provide('ga_translation_controller');
//(function() {

  //export const ga_translation_controller = 'ga_translation_controller';
  import * as angular from 'angular';

  var module = angular.module('ga_translation_controller', []);

  module.controller('GaTranslationController', function($scope,
      gaGlobalOptions) {
    $scope.options = {
      langs: gaGlobalOptions.languages
    };
  });
//})();
