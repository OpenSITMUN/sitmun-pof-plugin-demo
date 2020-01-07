import { NgModule, ModuleWithProviders } from '@angular/core';

//Hybrid app imports
import { UpgradeModule, setAngularJSGlobal } from '@angular/upgrade/static';

import {SitmunPluginCoreModule,LoginComponent,AccountEditComponent,AccountChangePasswordComponent,
        MapConfigurationManagerService,
        Layer, LayerConfiguration, LayerGroup} from 'sitmun-plugin-core';

import * as angular from 'angular';

//Angular js imports
import {topicServiceProvider} from './ajs-upgraded-providers';

//Tree imports
import {TreeComponentFacade} from './tree/tree.component';

@NgModule({
	imports: [
		SitmunPluginCoreModule,
		//Upgrade module import for angularjs modules
		UpgradeModule
	],
	declarations: [
		TreeComponentFacade
	],
	entryComponents: [
		//
	],
	providers: [
		//Tree module services
		topicServiceProvider
	]
})

export class SitmunPluginDemoModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: SitmunPluginDemoModule,
            providers: [
				topicServiceProvider
            ]
		}
	}

}
