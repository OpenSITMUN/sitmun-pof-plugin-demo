import * as angular from 'angular';


var module = angular.module('ga_timeselector_directive', [
    'ga_debounce_service',
    'ga_layerfilters_service',
    'ga_layers_service',
    'ga_maputils_service',
    'ga_slider_directive',
    'ga_time_service',
    'pascalprecht.translate'
  ]);

  module.controller('GaTimeSelectorDirectiveController',
      function($scope, gaLayerFilters) {
        $scope.layers = $scope.map.getLayers().getArray();
        $scope.layerFilter = gaLayerFilters.timeEnabled;
        $scope.isActive = false;
      }
  );

  module.directive('gaTimeSelectorBt', function($rootScope, gaTime) {
    var template = 
    '<div ga-slider ' +
       ' floor="{{options.minYear}}" ' +
       ' ceiling="{{options.maxYear}}"' +
       ' ng-model="currentYear"' +
       ' ga-data="years"' +
       ' ga-redraw="isActive"' +
       ' ga-keyboard-events="isActive && !is3dActive"' +
       ' ga-magnetize="true"' +
       ' ga-input-text="true"' +
       ' ga-unfit-to-bar="true">' +
    '</div>' +
    '<select ng-model="currentYear"' +
           ' ng-options="year.value as year.value for year in availableYears">' +
      '<option value="" disabled translate>time_select_year</option>' +
    '</select>' +
    '<button class="btn btn-default fa fa-play" ng-hide="is3dActive || isPlaying" ng-click="play()"></button>' +
    '<button class="btn btn-danger fa fa-stop" ng-show="!is3dActive && isPlaying" ng-click="stop()"></button>';
    
    return {
      restrict: 'A',
	  //define a local relative url
  	  //FIXME when creating an angular library, the resources are not processed and they should be defined inline
      //templateUrl: './partials/timeselector-bt.html',
      template: template,
      scope: {
        map: '=gaTimeSelectorBtMap'
      },
      controller: 'GaTimeSelectorDirectiveController',
      link: function(scope, elt, attrs, controller) {

        // Deactivate user form submission with Enter key
        elt.on('keypress', function(evt) {
          var charCode = evt.charCode || evt.keyCode;
          if (charCode === 13) { // Enter key's keycode
            return false;
          }
        });

        // Update the status of the directive
        var timeEnabledLayers = [];
        var updateStatus = function() {
          if (!timeEnabledLayers.length) {
            scope.isActive = false;
          } else {
            scope.isActive = !!(gaTime.get());
          }
          elt.toggleClass('ga-time-selector-enabled',
              !!timeEnabledLayers.length);
        };

        // Toggle the state of the component between active and enable
        scope.toggle = function(evt) {
          scope.isActive = !scope.isActive;
          $rootScope.$broadcast('gaTimeSelectorToggle', scope.isActive);

          // Avoid the add of # at the end of the url
          if (evt) {
            evt.preventDefault();
          }
        };

        // Activate/deactivate automatically the time selector
        scope.$on('gaTimeChange', updateStatus);

        // If there is one or more timeEnabled layer we display the button
        scope.$watchCollection('layers | filter:layerFilter', function(layers) {
          timeEnabledLayers = layers;
          updateStatus();
        });
      }
    };
  });

  module.directive('gaTimeSelector', function(gaDebounce, gaTime,
      $timeout) {

    // Magnetize a year to the closest available year
    var magnetize = function(currentYear, availableYears) {
      var minGap = null;
      for (var i = 0, length = availableYears.length; i < length;
        i++) {
        var elt = availableYears[i];
        var gap = elt.value - currentYear;
        minGap = (!minGap || (Math.abs(gap) < Math.abs(minGap))) ?
          gap : minGap;
      }
      if (minGap) {
        currentYear += minGap;
      }
      return currentYear;
    };

    var template = 
    '<button class="ga-btn"' +
           ' ng-click="toggle($event)"' +
           ' ng-class="{' +
           '   \'ga-btn-active\': isActive' +
           ' }"' +
           ' translate-attr="{title: \'time_\' + (isActive ? \'hide\' : \'show\')}">' +
      '<i class="fa fa-ga-circle-bg"></i>' +
      '<i class="fa fa-ga-time-selector"></i>' +
    '</button>';

    return {
      restrict: 'A',
	  //define a local relative url
      //templateUrl: './partials/timeselector.html',
  	  //FIXME when creating an angular library, the resources are not processed and they should be defined inline
      template: template,
      scope: {
        map: '=gaTimeSelectorMap',
        ol3d: '=gaTimeSelectorOl3d',
        options: '=gaTimeSelectorOptions'
      },
      controller: 'GaTimeSelectorDirectiveController',
      link: function(scope, elt, attrs, controller) {
        scope.years = [];
        var promise;

        // Copy from slider
        var nextValue = function(value, list) {
          if (list && list.length > 0) {
            for (var i = list.length - 1; i >= 0; i--) {
              var elt = list[i];
              if (elt.value === value) {
                value = magnetize(value, list.slice(i + 1, list.length));

                // if we have reached the end of the list restart from the
                // beginning
                if (value === elt.value && list.length > 1) {
                  value = list[0].value;
                }
                break;
              }
            }
          }
          return value;
        };

        var applyNextYear = function() {
          var nextYear = nextValue(scope.currentYear, scope.availableYears);
          if (nextYear !== scope.currentYear) {
            scope.currentYear = nextYear;
            promise = $timeout(applyNextYear, 1000);
          } else {
            scope.stop();
          }
        };

        scope.play = function() {
          scope.isPlaying = true;
          applyNextYear();
        };

        scope.stop = function() {
          scope.isPlaying = false;
          if (promise) {
            $timeout.cancel(promise);
            promise = undefined;
          }
        };

        // Update the status of the directive
        var timeEnabledLayers = [];
        var updateStatus = function() {
          if (!timeEnabledLayers.length) {
            scope.isActive = false;
            return;
          }
          scope.isActive = !!(gaTime.get());
        };

        // Events to force the state of the component from another directive
        scope.$on('gaTimeSelectorToggle', function(evt, active) {
          scope.isActive = active;
        });

        // Activate/deactivate automatically the time selector
        scope.$on('gaTimeChange', function(evt, time) {
          if (angular.isDefined(time) &&
              scope.currentYear !== parseFloat(time)) {
            scope.currentYear = time;
          }
          updateStatus();
          if (!scope.isActive) {
            scope.stop();
          }
        });

        // Update then magnetize the current year
        scope.$watchCollection('layers | filter:layerFilter',
            function(olLayers) {
              timeEnabledLayers = olLayers;
              // We update the list of dates available then
              // we magnetize the current year value
              // to the closest available year if needed
              if (updateDatesAvailable(olLayers)) {
                scope.currentYear = magnetize(scope.currentYear,
                    scope.availableYears);
              }
              updateStatus();
            });

        // Watch if 3d is active
        scope.$watch(function() {
          return scope.ol3d && scope.ol3d.getEnabled();
        }, function(active) {
          scope.stop();
          scope.is3dActive = active;
          elt.toggle(scope.isActive);
        });

        // Activate/deactivate the component
        scope.$watch('isActive', function(active, old) {
          // On the first call old and active are false both but we don't
          // want to apply the year
          if (active !== old) {
            scope.years = active ? scope.options.years : [];
            applyNewYear((active ? scope.currentYear : undefined));
            elt.toggle(active);
          }
        });

        // currentYear is always an integer
        scope.$watch('currentYear', function(year) {
          if (scope.isActive) {
            applyNewYearDebounced(year);
          }
        });

        /** Utils **/

        // Apply the year selected
        var applyNewYear = function(year) {
          var newYear = (year) ? '' + year : year;

          // Only valid values are allowed: undefined, null or
          // minYear <= newYear <= maxYear
          if ((!newYear || (scope.options.minYear <= newYear &&
            newYear <= scope.options.maxYear))) {
            gaTime.set(newYear);
          }
        };
        var applyNewYearDebounced = gaDebounce.debounce(applyNewYear, 200,
            false);

        // Update the list of years available
        scope.availableYears = [];
        var updateDatesAvailable = function(olLayers) {
          var magnetizeCurrentYear = true;
          scope.availableYears = [];
          for (var i = 0, length = scope.options.years.length; i < length;
            i++) {
            var year = scope.options.years[i];
            year.available = false;
            olLayers.forEach(function(olLayer, opt) {
              if (year.available || !olLayer.timeEnabled) {
                return;
              }
              var timestamps = olLayer.timestamps || [];
              for (var i = 0, length = timestamps.length; i < length; i++) {
                var yearTimestamp = gaTime.getYearFromTimestamp(
                    timestamps[i]);
                if (year.value === yearTimestamp) {
                  year.available = true;
                  scope.availableYears.push(year);
                  if (year.value === scope.currentYear) {
                    magnetizeCurrentYear = false;
                  }
                  break;
                }
              }
            });
          }
          return magnetizeCurrentYear;
        };

        // Initialize the state of the component
        scope.currentYear = gaTime.get() || scope.options.maxYear;
        if (gaTime.get()) {
          scope.isActive = true;
        }
      }
    };
  });
