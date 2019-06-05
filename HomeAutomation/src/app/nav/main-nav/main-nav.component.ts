import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'ha-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.scss']
})
export class MainNavComponent implements OnInit {

  @Output()
  toggle = new EventEmitter<void>();
  constructor() { }

  ngOnInit() {
  }
  onToggleSidenav(){
    this.toggle.emit();
  }
}
