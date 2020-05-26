import {Routes} from "@angular/router";
import {HomeComponent} from "./home/home.component";
import {UserComponent} from "./user/user.component";
import { LoginComponent } from './user/login/login.component';
import { RegisterComponent } from './user/register/register.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { ProfileComponent } from './profile/profile.component';

export const appRoutes : Routes =[
    {path: "home", component : ToolbarComponent,
        children : [{path: "", component : HomeComponent}]},
    {path : "login", component : UserComponent,
        children : [{path:"", component : LoginComponent}]},
    {path : "register", component : UserComponent,
        children : [{path:"", component : RegisterComponent}]},
    {path:"", redirectTo:"/login", pathMatch:"full"},
    {path:"profile", component : ProfileComponent}
];