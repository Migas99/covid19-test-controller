import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {UserComponent} from "./user/user.component";
import { LoginComponent } from './user/login/login.component';
import { RegisterComponent } from './user/register/register.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { ProfileComponent } from './profile/profile.component';
import { AuthGuardService } from './services/AuthGuard.service';
import { UsersListComponent} from './users-list/users-list.component'
import { UpdateUserComponent} from './update-user/update-user.component'

const routes: Routes = [
    {path: "home", component : ToolbarComponent,
        children : [{path: "", component : HomeComponent}], canActivate: [AuthGuardService]},

    //Login
    {path : "login", component : UserComponent,
        children : [{path:"", component : LoginComponent}]},

    //Registo
    {path : "register", component : UserComponent,
        children : [{path:"", component : RegisterComponent}]},

    //Perfil do utilizador com sessao iniciada
    {path:"profile", component : ToolbarComponent, 
        children : [{path:"", component : ProfileComponent}], canActivate: [AuthGuardService]},

    //Lista de utilizadores
    {path:"users", component : ToolbarComponent,
        children : [{path:"", component : UsersListComponent}], canActivate: [AuthGuardService]},

    //Utilizador selecionado
    {path:"users/:id", component : ToolbarComponent,
        children : [{path:"", component : ProfileComponent}], canActivate: [AuthGuardService]},
    
    //Lista de tecnicos
    {path:"technicians", component : ToolbarComponent,
        children : [{path:"", component : UsersListComponent}], canActivate: [AuthGuardService]},
    
    //Tecnico selecionado
    {path:"technicians/:id", component : ToolbarComponent,
        children : [{path:"", component : ProfileComponent}], canActivate: [AuthGuardService]},

    //Lista de infetados
    {path:"users/infected", component : ToolbarComponent,
        children : [{path:"", component : UsersListComponent}], canActivate: [AuthGuardService]},

    //Update User
    {path:"users/update/:id", component : ToolbarComponent,
        children : [{path:"", component : UpdateUserComponent}], canActivate: [AuthGuardService]},
    
    //Default
    {path:"", redirectTo:"/login", pathMatch:"full"},

    //404
    //{path: '/*path', redirectTo: "/kuwabuga"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
