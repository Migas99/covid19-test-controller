import { Component, OnInit } from '@angular/core';
import { covid19APIService } from 'src/app/services/covid19API.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import {  ShareDataService } from '../services/shareData.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  constructor(private covid19APIService : covid19APIService, private router : Router, private data: ShareDataService, private _location: Location) { }

  userRole:String;

  ngOnInit(): void {
    this.covid19APIService.getProfile().subscribe(
      (user : any)=>{
        this.userRole = user.role;
        this.data.currentROLE = user.role;
        this.data.currentID = user._id;
      },
      (err : HttpErrorResponse) =>{
        console.log(err);
      }
    );
  }

  logout(){
    try{
      localStorage.removeItem('currentUser');
      this.router.navigate(["/login"]);
    }catch(err){
      console.log(err);
    }
  }

  backPreviousButton(){
    this._location.back();
  }
}
