import { Component, OnInit } from '@angular/core';
import { covid19APIService } from 'src/app/services/covid19API.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Request } from '../classes/requests';
import { ActivatedRoute } from '@angular/router';
import * as fileSaver from 'file-saver/';
import { ShareDataService } from '../services/shareData.service';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.css']
})
export class RequestsComponent implements OnInit {

  constructor(private covid19APIService: covid19APIService, public router: Router, private route: ActivatedRoute, public data: ShareDataService) { }

  requestInfo: Request = null;
  id: String;
  addTestResult: boolean = false;
  canDownloadFirst: boolean = false;
  canDownloadSecond: boolean = false;

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
    });

    this.covid19APIService.getRequest(this.id).subscribe(
      (request: any) => {
        this.requestInfo = request;
        console.log(this.requestInfo);
        this.canAddTestResult();
        this.canDownloadTest();
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
      },
      (err: HttpErrorResponse) => {
        console.log(err);
      }
    );
  }

  canAddTestResult() {
    if (this.requestInfo.firstTest != null) {
      if (this.requestInfo.firstTest.result == null && this.requestInfo.firstTest.testDate != null) {
        console.log("sadfsdafasdf     " + this.requestInfo.firstTest.responsibleTechnicianId);
        console.log(this.data.currentID);
        if (this.requestInfo.firstTest.responsibleTechnicianId === this.data.currentID) {
          this.addTestResult = true;
        }
      }
    } else if (this.requestInfo.secondTest) {
      if (!this.requestInfo.secondTest.result && this.requestInfo.secondTest.testDate) {
        if (this.requestInfo.secondTest.responsibleTechnicianId === this.data.currentID) {
          this.addTestResult = true;
        }
      }
    }
  }

  canDownloadTest() {
    if (this.requestInfo.firstTest != null) {
      if (this.requestInfo.firstTest.pdfFilePath != null) {
        this.canDownloadFirst = true;
      }
    }
    if (this.requestInfo.secondTest) {
      if (this.requestInfo.secondTest.pdfFilePath != null) {
        this.canDownloadSecond = true;
      }
    }
  }
}
