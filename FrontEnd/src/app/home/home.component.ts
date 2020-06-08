import { Component, OnInit, Input } from '@angular/core';
import { covid19APIService } from 'src/app/services/covid19API.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private covid19APIService : covid19APIService) { }

  userRole: String;

  ngOnInit(): void {
    this.covid19APIService.getProfile().subscribe(
      (user : any)=>{
        
        this.userRole = user.role;
      },
      (err : HttpErrorResponse) =>{
        console.log(err);
      }
    );
    
  }
}
