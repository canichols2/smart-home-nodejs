import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeviceListComponent } from './device-list/device-list.component';
import { AddDeviceComponent } from './add-device/add-device.component';
import { EditDeviceComponent } from './edit-device/edit-device.component';
import { DeviceComponent } from './device/device.component';
import { ControlComponent } from './control.component';
import { Routes, RouterModule } from '@angular/router';
import { MaterialModule } from '../shared/material/material.module';


const routes: Routes = [
  {path:'',component:ControlComponent}
];


@NgModule({
  declarations: [DeviceListComponent, AddDeviceComponent, EditDeviceComponent, DeviceComponent, ControlComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MaterialModule
  ]  
})
export class ControlModule { }
