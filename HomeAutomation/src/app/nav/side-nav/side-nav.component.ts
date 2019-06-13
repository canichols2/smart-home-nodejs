import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'ha-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit {

  // public links: [
  //   { name: string, linkArr: string[] }
  // ] = [
  //   {name:"Home",linkArr:['/']},
  //   {name:"My Devices",linkArr:['/devices']},
  //   {name:"Link new device",linkArr:['/devices/new']},
  //   {name:"How To",linkArr:['#']},
  //   // {name:"",linkArr:['/devices']},
  // ]

  @Output()
  closeSidenav = new EventEmitter<void>();
  constructor() { }

  ngOnInit() {
  }
  onClose() {
    this.closeSidenav.emit();
  }
}
