import { Component, OnInit } from '@angular/core';
import { covid19APIService } from 'src/app/services/covid19API.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private covid19APIService : covid19APIService, private router : Router) { }

  ngOnInit(): void {
  }

  username:String = "";
  password:String = "";
  resultado:String;

  login(){
    this.covid19APIService.login(this.username, this.password).subscribe(
      (user : any)=>{
        if(user && user.token){
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.router.navigate(["/home"]);
        }
      },
      (err : HttpErrorResponse) =>{
        console.log(err);
        this.resultado = err.error.Error;
      }
    )
  }
}
