import { Component, OnInit } from '@angular/core';
import { covid19APIService } from 'src/app/services/covid19API.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  constructor(private covid19APIService : covid19APIService, private router : Router) { }

  ngOnInit(): void {
  }

  logout(){
    try{
      localStorage.removeItem('currentUser');
      this.router.navigate(["/login"]);
    }catch(err){
      console.log(err);
    }
    // this.covid19APIService.logout().subscribe(
    //   (data : any)=>{
    //     localStorage.removeItem('currentUser');
    //     this.router.navigate(["/login"]);
    //   },
    //   (err : HttpErrorResponse) =>{
    //     console.log(err);
    //   }
    // )
  }
}
