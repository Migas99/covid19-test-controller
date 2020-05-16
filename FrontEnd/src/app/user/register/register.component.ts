import { Component, OnInit } from '@angular/core';
import { covid19APIService } from 'src/app/services/covid19API.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Users } from 'src/app/classes/users';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private covid19APIService : covid19APIService, private router : Router) { }

  ngOnInit(): void {
  }
  
  user = new Users();

  resultado;

  isChecked:boolean = false;
  
  isSelected(checked:String){
    if(checked === "other"){
      this.isChecked = true;
      this.user.gender = "";
    }
    else{
      this.isChecked = false;
      if(checked === "male"){
        this.user.gender = "male";
      }
      if(checked === "female"){
        this.user.gender = "female";
      }
    }
  }

  register(){
    this.covid19APIService.register(this.user).subscribe(
      (data : any)=>{
        this.resultado = data;
      },
      (err : HttpErrorResponse) =>{
        this.resultado = err.error;
      }
    )
  }
}
