import { Component, OnInit, Input } from '@angular/core';
import { Device } from 'src/app/models/device.model';

@Component({
  selector: 'ha-device',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.scss']
})
export class DeviceComponent implements OnInit {
  elevated:boolean = false

  @Input()
  device: Device;
  constructor() { }

  ngOnInit() {
  }

}
