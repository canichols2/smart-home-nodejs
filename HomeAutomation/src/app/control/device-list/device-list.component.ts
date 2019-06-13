import { DeviceService } from './../../services/device.service';
import { Device } from './../../models/device.model';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ha-device-list',
  templateUrl: './device-list.component.html',
  styleUrls: ['./device-list.component.scss']
})
export class DeviceListComponent implements OnInit {
  devices: Device[];

  constructor(private deviceService:DeviceService) { }

  ngOnInit() {
    this.devices = this.deviceService.devices;
  }

}
