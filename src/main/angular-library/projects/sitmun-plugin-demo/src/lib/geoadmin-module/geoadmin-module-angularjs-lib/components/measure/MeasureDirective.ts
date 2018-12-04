import * as angular from 'angular';
import * as ol from 'openlayers';

var module = angular.module('ga_measure_directive', [
    'ga_measure_service'
  ]);

  module.directive('gaMeasure', function(gaMeasure, gaGlobalOptions) {
    var template = 
    '<div ng-if="coord" class="ga-coord">' +
      '<i class="fa fa-ga-marker"></i> {{coord}}' +
    '</div>' +
    '<div ng-if="distance && !surface" class="ga-distance">' +
      '<i class="fa fa-resize-horizontal"></i> {{distance | measure}}' +
    '</div>' +
    '<div ng-if="surface">' +
      '<div>' +
        '<i class="ga-perimeter"></i> {{distance | measure}}' +
      '</div>' +
      '<div>' +
        '<i class="ga-area"></i> {{surface | measure:\'area\':[\' km&sup2\', \' m&sup2\']}}' +
      '</div>' +
    '</div>' +
    '<!--p class="pull-right">{{azimuth | measure:\'angle\':[\'&deg\']}}</p-->';
    return {
      restrict: 'A',
	  //define a local relative url
  	  //FIXME when creating an angular library, the resources are not processed and they should be defined inline
      //templateUrl: './partials/measure.html',
      template: template,
      scope: {
        feature: '=gaMeasure',
        precision: '=gaCoordinatePrecision'
      },
      link: function(scope, elt) {
        var deregisterKey;
        var update = function(feature) {
          scope.coord = undefined;
          scope.distance = undefined;
          scope.surface = undefined;
          scope.azimuth = undefined;

          var geom = feature.getGeometry();
          if (geom instanceof ol.geom.Point) {
            scope.coord = gaMeasure.formatCoordinates(geom.getCoordinates(),
                scope.precision);
          } else {
            scope.distance = gaMeasure.getLength(geom);
            scope.surface = gaMeasure.getArea(geom);
            // scope.azimuth = gaMeasure.getAzimuth(geom);
          }
        };
        var useFeature = function(newFeature) {
          if (deregisterKey) {
            ol.Observable.unByKey(deregisterKey);
            deregisterKey = undefined;
          }
          if (newFeature) {
            deregisterKey = newFeature.on('change', function(evt) {
              scope.$applyAsync(function() {
                update(evt.target);
              });
            });
            update(newFeature);
          }
        };
        scope.$watch('feature', useFeature);
      }
    };
  });