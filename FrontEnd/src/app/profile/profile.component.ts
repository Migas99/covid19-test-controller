import { Component, OnInit } from '@angular/core';
import { covid19APIService } from 'src/app/services/covid19API.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Users } from '../classes/users';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(private covid19APIService : covid19APIService, private router : Router, private route:ActivatedRoute) { }

  userInfo = new Users();
  id:String;

  ngOnInit(): void {
    if(this.router.url === "/profile"){
      this.covid19APIService.getProfile().subscribe(
        (user : any)=>{
          this.userInfo = user;
        },
        (err : HttpErrorResponse) =>{
          console.log(err);
        }
      );
    }
    else{
      this.id = this.route.snapshot.paramMap.get('id');
      this.covid19APIService.getUser(this.id).subscribe(
        (user : any)=>{
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
}
