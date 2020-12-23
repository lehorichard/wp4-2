import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {FlashMessagesModule} from 'angular2-flash-messages';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NavbarComponent} from './components/navbar/navbar.component';
import {ImageListComponent} from './components/image-list/image-list.component';
import {ImageViewComponent} from './components/image-view/image-view.component';
import {ImageUploadComponent} from './components/image-upload/image-upload.component';
import {ImageEditComponent} from './components/image-edit/image-edit.component';
import {UsersComponent} from './components/users/users.component';
import {UserImagesComponent} from './components/user-images/user-images.component';
import {LoginComponent} from './components/login/login.component';
import {RegisterComponent} from './components/register/register.component';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ImageListComponent,
    ImageViewComponent,
    ImageUploadComponent,
    ImageEditComponent,
    UsersComponent,
    UserImagesComponent,
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    FontAwesomeModule,
    BrowserAnimationsModule,
    FlashMessagesModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
