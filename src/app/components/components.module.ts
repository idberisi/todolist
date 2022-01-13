import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsComponent } from './tabs/tabs.component';

const modules:any = [
  TabsComponent
];

@NgModule({
  declarations: modules,
  imports: [
    CommonModule
  ],
  exports: modules
})
export class ComponentsModule { }
