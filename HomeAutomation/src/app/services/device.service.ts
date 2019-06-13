import { Device } from './../models/device.model';
import { Action, Power, Lock,Open,Height } from './../models/action.model';
import { Injectable } from '@angular/core';
import { DeviceType } from '../models/device-type.model';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  public devices:Device[] = [
    {
      name: 'My Desktop',
      actions: [
        <Power>{name:"PC Power",icon:"power_settings_new", power:true,action : ()=>{}},
        <Lock>{name:"Lock PC",icon:"lock",locked:true ,action : function(){}},
        <Open>{name:"Open Case",icon:"settings_ethernet", open:true,action : ()=>{}},
        <Height>{name:"Desk Height",icon:"power_settings_new", height:20,action : ()=>{}},
      ],
      type: DeviceType.Computer
    },
    {
      name: 'My Laptop',
      actions: [],
      type: DeviceType.Computer
    },
    {
      name: 'My Workstation',
      actions: [],
      type: DeviceType.Computer
    },
    {
      name: 'Macbook Pro',
      actions: [],
      type: DeviceType.Macbook
    }
  ]

  constructor() { }

}
