import { Component, OnInit } from '@angular/core';
import { covid19APIService } from 'src/app/services/covid19API.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Users } from '../classes/users';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(private covid19APIService : covid19APIService, private router : Router) { }

  resultado:String = "";
  userInfo = new Users();

  ngOnInit(): void {

    this.covid19APIService.getProfile().subscribe(
      (user : any)=>{
        console.log(user);
        this.userInfo = user;
      },
      (err : HttpErrorResponse) =>{
        console.log(err);
        this.resultado = err.error.Error;
      }
    )
  }

}
