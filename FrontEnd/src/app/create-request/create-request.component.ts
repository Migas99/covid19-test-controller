import { Component, OnInit } from '@angular/core';
import { covid19APIService } from 'src/app/services/covid19API.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';



@Component({
  selector: 'app-create-request',
  templateUrl: './create-request.component.html',
  styleUrls: ['./create-request.component.css']
})
export class CreateRequestComponent implements OnInit {

  constructor(private covid19APIService: covid19APIService, private router: Router) { }

  description: String = "";
  priority: String = "";
  httpError: String = "";

  ngOnInit(): void {
  }

  createRequest() {
    this.covid19APIService.createRequest(this.description, this.priority).subscribe(
      (user: any) => {
        alert("REQUEST CRIADO COM SUCESSO");
        this.router.navigate(['/myRequests']);
      },
      (err: HttpErrorResponse) => {
        console.log(err);
        this.httpError = err.error.Error;
      }
    );
  }
}
