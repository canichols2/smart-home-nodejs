import { ControlModule } from './control/control.module';
import { ControlComponent } from './control/control.component';
import { WelcomeComponent } from './home/welcome/welcome.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { ControlModule  } from "control/control.module";

const routes: Routes = [
  // {path: '', redirectTo:'home', pathMatch: 'full'},
  /* {
    path: 'devices',
    loadChildren: './control/control.module#ControlModule'
  } */
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
