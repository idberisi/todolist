import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewTaskModulePageRoutingModule } from './new-task-module-routing.module';

import { NewTaskModulePage } from './new-task-module.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewTaskModulePageRoutingModule
  ],
  declarations: [NewTaskModulePage]
})
export class NewTaskModulePageModule {}
