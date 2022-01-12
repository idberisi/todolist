import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewTaskModulePage } from './new-task-module.page';

const routes: Routes = [
  {
    path: '',
    component: NewTaskModulePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewTaskModulePageRoutingModule {}
