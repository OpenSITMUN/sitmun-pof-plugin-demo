import $ from 'jquery';
import * as angular from 'angular';
import * as ol from 'openlayers';

  var module = angular.module('ga_wms_service', [
    'ga_definepropertiesforlayer_service',
    'pascalprecht.translate',
    'ga_layers_service',
    'ga_maputils_service',
    'ga_urlutils_service',
    'ga_translation_service',
    'ga_tilegrid_service'
  ]);

  /**
   * Manage external WMS layers
   */
  module.provider('gaWms', function() {
    this.$get = function(gaDefinePropertiesForLayer, gaMapUtils, gaUrlUtils,
        gaGlobalOptions, $q, gaLang, gaLayers, gaTileGrid) {

      // Default subdomains for external WMS
      var DFLT_SUBDOMAINS = ['', '0', '1', '2', '3', '4'];

      var getCesiumImageryProvider = function(layer, subdomains) {
  	    //FIXME any Cessium reference/functionality has been commented
        /*
        var params = layer.getSource().getParams();
        var wmsParams = {
          layers: params.LAYERS,
          format: params.FORMAT || 'image/png',
          service: 'WMS',
          version: params.VERSION || '1.3.0',
          request: 'GetMap',
          crs: 'EPSG:4326',
          bbox: '{southProjected},{westProjected},' +
                '{northProjected},{eastProjected}',
          width: '256',
          height: '256',
          styles: params.STYLES || '',
          transparent: 'true',
		  //FIXME define mandatory parameter
          srs: null
        };

        if (wmsParams.version === '1.1.1') {
          wmsParams.srs = wmsParams.crs;
          delete wmsParams.crs;
          wmsParams.bbox = '{westProjected},{southProjected},' +
                           '{eastProjected},{northProjected}';
        }

        var extent = gaGlobalOptions.defaultExtent;
        return new Cesium.UrlTemplateImageryProvider({
          minimumRetrievingLevel: gaGlobalOptions.minimumRetrievingLevel,
          url: new Cesium.Resource({
            url: gaUrlUtils.append(layer.url, gaUrlUtils.toKeyValue(wmsParams)),
            proxy: gaUrlUtils.getCesiumProxy()
          }),
          rectangle: gaMapUtils.extentToRectangle(extent),
          tilingScheme: new Cesium.GeographicTilingScheme(),
          hasAlphaChannel: true,
          availableLevels: gaGlobalOptions.imageryAvailableLevels,
          metadataUrl: gaGlobalOptions.imageryMetadataUrl,
          subdomains: gaUrlUtils.parseSubdomainsTpl(layer.url) ||
              DFLT_SUBDOMAINS
        });
        */
       return null;
      };

      var Wms = function() {

        // Test WMS 1.1.1 with  https://wms.geo.bs.ch/wmsBS
        var createWmsLayer = function(params, options, index) {
          options = options || {};

          // We get the gutter and the tileGridMinRes from the layersConfig
          // if possible.
          var tileGridMinRes;
          var config = gaLayers.getLayer(params.LAYERS);
          if (config) {
            if (config.gutter) {
              options.gutter = config.gutter;
            }

            tileGridMinRes = config.tileGridMinRes;
            if (config.resolutions) {
              tileGridMinRes = config.resolutions.slice(-1)[0];
            }
          }

          options.id = 'WMS||' + options.label + '||' + options.url + '||' +
              params.LAYERS;

          // If the WMS has a version specified, we add it in
          // the id. It's important that the layer keeps the same id as the
          // one in the url otherwise it breaks the asynchronous reordering of
          // layers.
          if (params.VERSION) {
            options.id += '||' + params.VERSION;

            if (options.useReprojection) {
              options.projection = 'EPSG:4326';
              options.id += '||true';
            }
          } else {
            // Set the default wms version
            params.VERSION = '1.3.0';
          }

          // If the url contains a template for subdomains we display the layer
          // as tiled WMS.
          var urls = gaUrlUtils.getMultidomainsUrls(options.url,
              DFLT_SUBDOMAINS);
          var SourceClass = ol.source.ImageWMS;
          var LayerClass = ol.layer.Image;
          var tileGrid;

		  //FIXME use TypeScript compliant sentences to define 'source' an 'layer'
          var source;
          var layer;
          if (urls.length > 1) {
            tileGrid = gaTileGrid.get(tileGridMinRes, 'wms');
            source = new ol.source.TileWMS({
              attributions: options.attribution,
              params: params,
              url: urls[0],
              urls: urls,
              gutter: options.gutter || 0,
              projection: options.projection,
              tileGrid: tileGrid
            });
  
            layer = new ol.layer.Tile({
              opacity: options.opacity,
              visible: options.visible,
              extent: options.extent,
              source: source
            });
          } else {
            source = new ol.source.ImageWMS({
              params: params,
              url: urls[0],
              ratio: options.ratio || 1,
              projection: options.projection
            });
  
            layer = new ol.layer.Image({
              opacity: options.opacity,
              visible: options.visible,
              extent: options.extent,
              source: source
            });
          }

          /*
          var source = new SourceClass({
            params: params,
            url: urls[0],
            urls: urls,
            gutter: options.gutter || 0,
            ratio: options.ratio || 1,
            projection: options.projection,
            tileGrid: tileGrid
          });

          var layer = new LayerClass({
            id: options.id,
            url: options.url,
            opacity: options.opacity,
            visible: options.visible,
            attribution: options.attribution,
            extent: options.extent,
            source: source,
            transition: 0
          });
          */

		  //FIXME save new properties
          layer.setProperties({"id": options.id});
          layer.setProperties({"transition": 0});
          gaDefinePropertiesForLayer(layer);
          layer.preview = !!options.preview;
          layer.displayInLayerManager = !layer.preview;
          layer.useThirdPartyData = gaUrlUtils.isThirdPartyValid(options.url);
          layer.label = options.label;
          layer.getCesiumImageryProvider = function() {
            return getCesiumImageryProvider(layer, null);
          };
          return layer;
        };

        // Create an ol WMS layer from GetCapabilities informations
        this.getOlLayerFromGetCapLayer = function(getCapLayer) {
          var wmsParams = {
            LAYERS: getCapLayer.Name,
            VERSION: getCapLayer.wmsVersion
          };
          var wmsOptions = {
            url: getCapLayer.wmsUrl,
            label: getCapLayer.Title,
            extent: gaMapUtils.intersectWithDefaultExtent(getCapLayer.extent),
            useReprojection: getCapLayer.useReprojection
          };
		  //FIXME define all mandatory parameters
          return createWmsLayer(wmsParams, wmsOptions, null);
        };

        // Create a WMS layer and add it to the map
        this.addWmsToMap = function(map, layerParams, layerOptions, index) {
		  //FIXME define all mandatory parameter
          var olLayer = createWmsLayer(layerParams, layerOptions, null);
          if (index) {
            map.getLayers().insertAt(index, olLayer);
          } else {
            map.addLayer(olLayer);
          }
          return olLayer;
        };

        // Make a GetLegendGraphic request
        this.getLegend = function(layer) {
          var defer = $q.defer();
          var params = layer.getSource().getParams();
          var html = '<img alt="No legend available" src="' +
              gaUrlUtils.append(layer.url, gaUrlUtils.toKeyValue({
                request: 'GetLegendGraphic',
                layer: params.LAYERS,
                style: params.STYLES || 'default',
                service: 'WMS',
                version: params.VERSION || '1.3.0',
                format: 'image/png',
                sld_version: '1.1.0',
                lang: gaLang.get()
              })) + '"></img>';
          defer.resolve({data: html});
          return defer.promise;
        };
      };
      return new Wms();
    };
  });