import { Component, OnInit } from '@angular/core';
import { covid19APIService } from 'src/app/services/covid19API.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Request } from '../classes/requests';

@Component({
  selector: 'app-requests-list',
  templateUrl: './requests-list.component.html',
  styleUrls: ['./requests-list.component.css']
})
export class RequestsListComponent implements OnInit {

  constructor(private covid19APIService : covid19APIService, public router : Router) { }

  requestsList: Request[];

  ngOnInit(): void {
    if(this.router.url === "/myRequests"){
      this.covid19APIService.myRequests().subscribe(
        (requests : any) =>{
          this.requestsList = requests;
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
    if(this.router.url === "/handledRequests"){
      this.covid19APIService.handledRequests().subscribe(
        (requests : any) =>{
          this.requestsList = requests;
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
    if(this.router.url === "/unhandledRequests"){
      this.covid19APIService.unhandledRequests().subscribe(
        (requests : any) =>{
          this.requestsList = requests;
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

    if(this.router.url === "/technicianRequests"){
      this.covid19APIService.technicianRequests().subscribe(
        (requests : any) =>{
          this.requestsList = requests;
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

  requestInfo(id: String){
    this.router.navigate(['/' + 'request' + '/' + id]);
  }
}
