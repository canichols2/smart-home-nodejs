import { FlexLayoutModule } from '@angular/flex-layout';
import { WelcomeComponent } from './home/welcome/welcome.component';
import { ControlModule } from './control/control.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireFunctionsModule } from '@angular/fire/functions';
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from '../environments/environment';

import { MainNavComponent } from './nav/main-nav/main-nav.component';
import { MaterialModule } from './shared/material/material.module';
import { HomeModule } from './home/home.module';
import { SideNavComponent } from './nav/side-nav/side-nav.component';
import { DeviceService } from './services/device.service';
import { NoopAnimationsModule, BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DeviceListComponent } from './control/device-list/device-list.component';
import { AddDeviceComponent } from './control/add-device/add-device.component';
import { EditDeviceComponent } from './control/edit-device/edit-device.component';
import { DeviceComponent } from './control/device/device.component';
import { ControlComponent } from './control/control.component';
import { NavLinksComponent } from './nav/nav-links/nav-links.component';

@NgModule({
  declarations: [
    AppComponent,
    MainNavComponent,
    SideNavComponent,
    NavLinksComponent,
  ],
  imports: [
    BrowserModule,
    NoopAnimationsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFireFunctionsModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireMessagingModule,
    MaterialModule,
    HomeModule,
    ControlModule,
    FlexLayoutModule
  ],
  providers: [DeviceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
