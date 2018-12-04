import $ from 'jquery';
import * as angular from 'angular';

var module = angular.module('ga_catalogitem_directive', [
    'ga_catalogtree_directive',
    'ga_layermetadatapopup_service',
    'ga_layers_service',
    'ga_maputils_service',
    'ga_previewlayers_service',
    'ga_event_service'
  ]);

  /**
   * See examples on how it can be used
   */
  module.directive('gaCatalogitem',
      function($compile, gaMapUtils, gaLayerMetadataPopup,
          gaPreviewLayers, gaLayers, gaEvent, gaGlobalOptions) {

        var addBodLayer = function(map, layerBodId) {
          if (gaLayers.getLayer(layerBodId)) {
            var layer = gaLayers.getOlLayerById(layerBodId);
            if (layer) {
              map.addLayer(layer);
            }
          }
        };

        // Don't add preview layer if the layer is already on the map
        var addPreviewLayer = function(map, item) {
          if (!item.selectedOpen) {
            gaPreviewLayers.addBodLayer(map, item.layerBodId);
          }
        };

        // Remove all preview layers
        var removePreviewLayer = function(map) {
          gaPreviewLayers.removeAll(map);
        };

        var getOlLayer = function(map, item) {
          if (!item) {
            return undefined;
          }
          return gaMapUtils.getMapOverlayForBodId(map, item.layerBodId);
        };

        return {
          restrict: 'A',
          replace: true,
          require: '^gaCatalogtree',
		  // define local relative url
  		  //FIXME when creating an angular library, the resources are not processed and they should be defined inline
          //templateUrl: './partials/catalogitem.html',
          template: 
          '<div class="ga-catalogitem-template" ng-switch="!!item.children">' + 
            '<div ng-switch-when="false" class="ga-catalogitem-leaf ga-catalogitem-entry"' + 
               ' ng-class="{\'ga-catalogitem-selected\': item.selectedOpen}">' + 
              '<label title="{{item.label}}" class="ga-truncate-text ga-checkbox">' + 
                '<input type="checkbox" ng-model="item.active" ng-model-options="{getterSetter: true}"/>' + 
                '<span></span>' + 
                '{{item.label}}' + 
                '<span ng-if="isQueryable(item.layerBodId)" class="ga-icon ga-btn fa fa-info-sign"></span>' + 
              '</label>' + 
              '<button ng-if="hasLegend(item.layerBodId)" class="ga-icon ga-btn fa fa-info-sign" ng-click="getLegend($event, item.layerBodId)"></button>' + 
            '</div>' + 
            '<div ng-switch-default="" class="ga-catalogitem-node">' + 
              '<a href="#" ng-click="toggle($event)" class="ga-catalogitem-entry ga-truncate-text" title="{{item.label}}">' + 
                '<i ng-class="{\'fa fa-minus\': item.selectedOpen, \'fa fa-plus\': !item.selectedOpen}"></i>' + 
                '{{item.label}}' + 
              '</a>' + 
              '<ul ng-if="item.selectedOpen">' + 
                '<li ng-repeat="child in item.children">' + 
                  '<div ga-catalogitem ga-catalogitem-item="child" ga-catalogitem-map="map" ga-catalogitem-options="options"></div>' + 
                '</li>' + 
              '</ul>' + 
            '</div>' + 
          '</div>'
          ,
          scope: {
            item: '=gaCatalogitemItem',
            map: '=gaCatalogitemMap',
            options: '=gaCatalogitemOptions'
          },
          controller: function($scope) {

            $scope.item.active = function(activate) {
              var layer = getOlLayer($scope.map, $scope.item);
              // setter called
              if (arguments.length) {
                if (layer) {
                  layer.visible = activate;
                }
                if (activate) {
                  $scope.item.selectedOpen = true;
                  // Add it if it's not already on the map
                  if (!layer) {
                    removePreviewLayer($scope.map);
                    addBodLayer($scope.map, $scope.item.layerBodId);
					//Notify a layer has been added and displayed the event will be propagated to the map component
                    layer = getOlLayer($scope.map, $scope.item);
                    $scope.$emit("gaDisplayedAdded", [layer, true]);
                  }
                }
              } else { // getter called
                return $scope.item.selectedOpen && layer && layer.visible;
              }
            };

            $scope.toggle = function(evt) {
              $scope.item.selectedOpen = !$scope.item.selectedOpen;
              evt.preventDefault();
              evt.stopPropagation();
            };

            $scope.getLegend = function(evt, bodId) {
              gaLayerMetadataPopup.toggle(bodId);
              evt.stopPropagation();
            };

            $scope.hasLegend = function(bodId) {
			  //Check if the item has legend information defined and if its display is enabled
              var item = gaLayers.getLayer(bodId);
              return item && item.hasLegend && 
                    !gaGlobalOptions.metadataInfoToolDisabled;
            }

            $scope.isQueryable = function(bodId) {
			  //Check if the item is queryable
              var item = gaLayers.getLayer(bodId);
              return item && item.queryable;
            }
          },

          compile: function(tEl, tAttr) {
            var contents = tEl.contents().remove();
            var compiledContent;
            return function(scope, iEl, iAttr, controller) {
              if (!compiledContent) {
                compiledContent = $compile(contents);
              }

              // Node
              if (angular.isDefined(scope.item.children)) {
                scope.$watch('item.selectedOpen', function(value) {
                  controller.updatePermalink(scope.item.id, value);
                });

              // Leaf
              } else {
                gaEvent.onMouseOverOut(iEl, function(evt) {
                  addPreviewLayer(scope.map, scope.item);
                }, function(evt) {
                  removePreviewLayer(scope.map);
                });
              }
              compiledContent(scope, function(clone, scope) {
                iEl.append(clone);
              });
            };
          }
        };
      }
  );
