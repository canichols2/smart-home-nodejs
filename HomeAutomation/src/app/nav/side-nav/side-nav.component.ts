import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'ha-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit {

  @Output()
  closeSidenav = new  EventEmitter<void>();
  constructor() { }

  ngOnInit() {
  }
  onClose(){
    this.closeSidenav.emit();
  }
}
