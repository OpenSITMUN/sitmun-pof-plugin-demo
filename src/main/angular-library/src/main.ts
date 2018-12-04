import { enableProdMode , TRANSLATIONS, TRANSLATIONS_FORMAT} from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import { UpgradeModule } from '@angular/upgrade/static';

import angular from 'angular';

if (environment.production) {
  enableProdMode();
}

// Ensure AngularJS destroys itself on hot reloads.
const rootElement = angular.element(document.body);
const oldInjector = rootElement.injector();
if (oldInjector) {
  oldInjector.get('$rootScope').$destroy();
  rootElement.data('$injector', null);
}

// Ensure Angular destroys itself on hot reloads.
if (window['ngRef']) {
  window['ngRef'].destroy();
}

declare const require;
// we use the webpack raw-loader to return the content as a string
const translations = require(`raw-loader!./locale/messages.ca.xlf`);

platformBrowserDynamic().
  bootstrapModule(AppModule, {
    providers: [
      {provide: TRANSLATIONS, useValue: translations},
      {provide: TRANSLATIONS_FORMAT, useValue: 'xlf'}
    ]
  }).
  then(ref => { 
    window['ngRef'] = ref;
  }).
  catch(console.error);
