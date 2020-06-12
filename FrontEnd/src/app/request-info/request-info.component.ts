import { Component, OnInit } from '@angular/core';
import { covid19APIService } from 'src/app/services/covid19API.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Result } from '../classes/results';

@Component({
  selector: 'app-request-info',
  templateUrl: './request-info.component.html',
  styleUrls: ['./request-info.component.css']
})
export class RequestInfoComponent implements OnInit {

  constructor(private covid19APIService : covid19APIService, public router : Router) { }

  beginDate: Date;
  endDate:Date;

  result:Result;
  show: boolean = false;
  httpError:String = "";

  ngOnInit(): void {

  }

  getInfo(){
    this.covid19APIService.requestsInfo(this.beginDate, this.endDate).subscribe(
      (results : any)=>{
        this.result = results;
        this.show =  true;
        this.httpError = "";
      },
      (err : HttpErrorResponse) =>{
        if(err.error === "Not authorized!"){
          alert("NÃO TEM PERMISSÃO PARA ACEDER A ESSA FUNCIONALIDADE");
          this.router.navigate(['/home']);
        };
        this.httpError = err.error.Error;
        console.log(err);

      }
    );
  }
}
