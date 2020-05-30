import { Component, OnInit } from '@angular/core';
import { covid19APIService } from 'src/app/services/covid19API.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Users } from '../classes/users';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {

  constructor(private covid19APIService : covid19APIService, private router : Router) { }

  usersList:Users[];

  ngOnInit(): void {
    if(this.router.url === "/users"){
      this.covid19APIService.getUsersList().subscribe(
        (users : any)=>{
          this.usersList = users;
        },
        (err : HttpErrorResponse) =>{
          if(err.error === "Not authorized!"){
            this.router.navigate(['/home']);
            alert("NÃO TEM PERMISSÃO PARA ACEDER A ESSA FUNCIONALIDADE");
          };
          console.log(err);
        }
      );
    }
    
    if(this.router.url === "/technicians"){
      this.covid19APIService.getTechniciansList().subscribe(
        (users : any)=>{
          this.usersList = users;
        },
        (err : HttpErrorResponse) =>{
          if(err.error === "Not authorized!"){
            this.router.navigate(['/home']);
            alert("NÃO TEM PERMISSÃO PARA ACEDER A ESSA FUNCIONALIDADE");
          };
          console.log(err);
        }
      );
    }

    if(this.router.url === "/users/infected"){
      this.covid19APIService.getInfectedUsers().subscribe(
        (users : any)=>{
          this.usersList = users;
        },
        (err : HttpErrorResponse) =>{
          if(err.error === "Not authorized!"){
            this.router.navigate(['/home']);
            alert("NÃO TEM PERMISSÃO PARA ACEDER A ESSA FUNCIONALIDADE");
          };
          console.log(err);
        }
      );
    }
  }
}
