import { Component, OnInit } from '@angular/core';
import { covid19APIService } from 'src/app/services/covid19API.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Request } from '../classes/requests';
import { ActivatedRoute } from '@angular/router';
import * as fileSaver from 'file-saver';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.css']
})
export class RequestsComponent implements OnInit {

  constructor(private covid19APIService: covid19APIService, public router: Router, private route: ActivatedRoute) { }

  request: Request = null;
  id: String;

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
    });

    this.covid19APIService.getRequest(this.id).subscribe(
      (request: any) => {
        this.request = request;
      },
      (err: HttpErrorResponse) => {
        if (err.error === "Not authorized!") {
          alert("NÃO TEM PERMISSÃO PARA ACEDER A ESSA FUNCIONALIDADE");
          this.router.navigate(['/home']);
        };
        console.log(err);
      }
    );
  }

  download(filePath: String) {
    console.log(filePath);
    this.covid19APIService.downloadTest(filePath).subscribe(
      (request: any) => {
        fileSaver.saveAs(request, 'TestResults.pdf');
        console.log(request);
        this.request = request;
      },
      (err: HttpErrorResponse) => {
        console.log(err);
      }
    );
  }
}
