import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ha-nav-links',
  templateUrl: './nav-links.component.html',
  styleUrls: ['./nav-links.component.scss']
})
export class NavLinksComponent implements OnInit {

  public links = [
    {name:"Home",linkArr:['/']},
    {name:"My Devices",linkArr:['/devices']},
    {name:"Link new device",linkArr:['/devices/new']},
    {name:"How To",linkArr:['#']},
    // {name:"",linkArr:['/devices']},
  ]
  constructor() { }

  ngOnInit() {
  }

}
