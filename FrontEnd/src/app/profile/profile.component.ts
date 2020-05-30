import { Component, OnInit } from '@angular/core';
import { covid19APIService } from 'src/app/services/covid19API.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Users } from '../classes/users';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(private covid19APIService : covid19APIService, private router : Router, private route:ActivatedRoute, private _location: Location) { }

  userInfo = new Users();
  id:String;

  ngOnInit(): void {
    if(this.router.url === "/profile"){
      this.covid19APIService.getProfile().subscribe(
        (user : any)=>{

          console.log(user);
          this.userInfo = user;
        },
        (err : HttpErrorResponse) =>{
          console.log(err);
        }
      );
    }
    else{
      this.route.paramMap.subscribe(params => {
          this.id = params.get('id');
      });

      this.covid19APIService.getUser(this.id).subscribe(
        (user : any)=>{
          console.log(user);
          this.userInfo = user;
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

  deleteUser(){
    this.covid19APIService.deleteUser(this.id).subscribe(
      (user : any)=>{
        this._location.back();
        alert("REMOVIDO COM SUCESSO");
      },
      (err : HttpErrorResponse) =>{
        if(err.error === "Not authorized!"){
          alert("NÃO TEM PERMISSÃO PARA ACEDER A ESSA FUNCIONALIDADE");
        };
        console.log(err);
      }
    );
  }
}
