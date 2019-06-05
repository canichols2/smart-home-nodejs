import { Device } from '../models/device.model';
import { DeviceService } from './../services/device.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ha-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.scss']
})
export class ControlComponent implements OnInit {
  devices: Device[];

  constructor(private deviceService:DeviceService) { }

  ngOnInit() {
    this.devices = this.deviceService.devices;
  }

}
