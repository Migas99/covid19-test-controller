import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {UserComponent} from "./user/user.component";
import { LoginComponent } from './user/login/login.component';
import { RegisterComponent } from './user/register/register.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { ProfileComponent } from './profile/profile.component';
import { AuthGuardService } from './services/AuthGuard.service';

const routes: Routes = [
  {path: "home", component : ToolbarComponent,
        children : [{path: "", component : HomeComponent}]},
    {path : "login", component : UserComponent,
        children : [{path:"", component : LoginComponent}]},
    {path : "register", component : UserComponent,
        children : [{path:"", component : RegisterComponent}]},
    {path:"", redirectTo:"/login", pathMatch:"full"},
    {path:"profile", component : ToolbarComponent, 
        children : [{path:"", component : ProfileComponent}], canActivate: [AuthGuardService]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
