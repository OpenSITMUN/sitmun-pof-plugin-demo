import $ from 'jquery';
import * as angular from 'angular';

  var module = angular.module('ga_file_service', [
    'pascalprecht.translate'
  ]);

  module.provider('gaFile', function() {

    this.$get = function($q, $http, $window, $translate) {

      var fileReader:FileReader, canceler;

      var File = function() {

        // Test the validity of the file size
        this.isValidFileSize = function(fileSize) {
          return !(fileSize > 20000000); // 20 Mo
        };

        this.isWmsGetCap = function(fileContent) {
          return /<(WMT_MS_Capabilities|WMS_Capabilities)/.test(fileContent);
        };

        this.isWmtsGetCap = function(fileContent) {
          return /<Capabilities/.test(fileContent);
        };

        this.isKml = function(fileContent) {
          return /<kml/.test(fileContent) && /<\/kml>/.test(fileContent);
        };

        this.isGpx = function(fileContent) {
          return /<gpx/.test(fileContent) && /<\/gpx>/.test(fileContent);
        };

        /**
         * param {!Blob} file .
         * return {angular.$q.Promise<string>} .
         */
        this.read = function(file) {
          var defer = $q.defer();
          // TODO FIXME to fix the error
          //error TS2339: Property 'LOADING' does not exist on type '{ new (): FileReader; prototype: FileReader; }'
		  // it is assumed that the FileReader.LOADING value is 1
          /*if (fileReader && fileReader.readyState === FileReader.LOADING) {
            fileReader.abort();
          }*/
          if (fileReader && fileReader.readyState === 1) {
            fileReader.abort();
          }
          fileReader = new FileReader();

          fileReader.onload = function(evt:any) {
			//FIXME avoid error property 'result' does not exist on evt.target 
            //defer.resolve(evt.target.result);
            defer.resolve(fileReader.result);
          };
          fileReader.onerror = function(evt) {
			//FIXME avoid error property 'error' does not exist on evt.target 
            //var err = evt.target.error;
            var err:any = fileReader.error;
            $window.console.error('Reading file failed: ', err);
            defer.reject({
              'message': err.code === 20 ?
                $translate.instant('operation_canceled') :
                $translate.instant('read_failed'),
              'reason': err.message
            });
          };
          fileReader.onprogress = function(evt) {
            defer.notify(evt);
          };
          // Read the file
          fileReader.readAsText(file);
          return defer.promise;
        };

        /**
         * param {string} url .
         * param {angular.$q.Deferred=} cancelP .
         * return {angular.$q.Promise<Blob>} .
         */
        this.load = function(url, cancelP) {

          if (canceler) {
            canceler.resolve();
          }
          canceler = cancelP || $q.defer();

          // Angularjs doesn't handle onprogress event
          var defer = $q.defer();
          $http.get(url, {
            timeout: canceler.promise
          }).then(function(response) {
            defer.resolve(response.data);
          }, function(reason) {
            $window.console.error('Uploading file failed: ', reason);
            defer.reject({
              'message': $translate.instant('upload_failed'),
              'reason': reason
            });
          });
          return defer.promise;
        };
      };
      return new File();
    };
  });