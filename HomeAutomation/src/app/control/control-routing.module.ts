import { DeviceComponent } from './device/device.component';

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ControlComponent } from './control.component';
// import { ControlModule  } from "control/control.module";

const routes: Routes = [
  {path: 'devices', component: ControlComponent, pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class ControlRoutingModule { }
