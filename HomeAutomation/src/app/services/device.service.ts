import { Device } from '../models/device.model';
import { Injectable } from '@angular/core';
import { DeviceType } from '../models/device-type.model';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  public devices:Device[] = [
    {
      name: 'My Desktop',
      actions: [],
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
