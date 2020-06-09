import { Component, OnInit } from '@angular/core';
import { covid19APIService } from 'src/app/services/covid19API.service';
import { HttpErrorResponse } from '@angular/common/http';
import {  ShareDataService } from '../services/shareData.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private covid19APIService : covid19APIService, public data: ShareDataService) { }

  userRole: String;

  ngOnInit(): void {
    
  }
}
