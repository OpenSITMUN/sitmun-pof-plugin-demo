import {Directive, ElementRef, Injector, Input} from '@angular/core';
import {UpgradeComponent} from '@angular/upgrade/static';

// treeComponent angularjs typescript definition
export const treeComponent = {
  selector: 'treeModule',
  //FIXME when creating an angular library, the resources are not processed and they should be defined inline
  //templateUrl: './tree.component.html',
  //stylesUrls: ['./tree.component.css'],
  template: 
  '<geoadmin-module ' +
    ' ng-controller="GaTreeMapConfigurationController as controller"' +
    ' ng-show="controller.getVisibility()"' +
        ' extent="{{$ctrl.extent?$ctrl.extent:null}}"' +
        ' tree-configuration="{{$ctrl.treeConfiguration?$ctrl.treeConfiguration:null}}"' +
        ' backgrounds-configuration="{{$ctrl.backgroundsConfiguration?$ctrl.backgroundsConfiguration:null}}"' +
        ' situation-map-configuration="{{$ctrl.situationMapConfiguration?$ctrl.situationMapConfiguration:null}}"' +
        ' application-configuration="{{$ctrl.applicationConfiguration?$ctrl.applicationConfiguration:null}}"' +
        ' language-configuration="{{$ctrl.languageConfiguration?$ctrl.languageConfiguration:null}}"' +
        ' default-attribution="{{$ctrl.defaultAttribution?$ctrl.defaultAttribution:null}}">' +
  '</geoadmin-module>',
  styles: [
    'tree-module {' +
      'height:100%;' +
      'width:100%;' +
    '}'
  ],
  bindings: {
  },
  controller: class TreeComponent {
    treeConfiguration: any;
    backgroundsConfiguration: any;
    situationMapConfiguration: any;
    applicationConfiguration: any;
    extent: any;
    languageConfiguration:string;
    defaultAttribution:string;
  }
};

// TreeComponent angular module wrapper (upgrades the angularjs directive)
@Directive({selector: treeComponent.selector})
export class TreeComponentFacade extends UpgradeComponent {
  @Input() treeConfiguration;
  @Input() backgroundsConfiguration;
  @Input() situationMapConfiguration;
  @Input() applicationConfiguration;
  @Input() languageConfiguration;
  @Input() defaultAttribution;
  @Input() extent;
  constructor(elementRef: ElementRef, injector: Injector) {
    super(treeComponent.selector, elementRef, injector);
  }
}
