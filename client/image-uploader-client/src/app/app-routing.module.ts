import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ImageEditComponent } from './components/image-edit/image-edit.component';
import { ImageListComponent } from './components/image-list/image-list.component';
import { ImageUploadComponent } from './components/image-upload/image-upload.component';
import { ImageViewComponent } from './components/image-view/image-view.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { UserImagesComponent } from './components/user-images/user-images.component';
import { UsersComponent } from './components/users/users.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: 'image-list', component: ImageListComponent },
  { path: 'image-view/:imageId', component: ImageViewComponent },
  { path: 'image-upload', component: ImageUploadComponent, canActivate: [AuthGuard] },
  { path: 'image-edit', component: ImageEditComponent, canActivate: [AuthGuard] },
  { path: 'users', component: UsersComponent },
  { path: 'user-images/:userId', component: UserImagesComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: 'image-list', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
