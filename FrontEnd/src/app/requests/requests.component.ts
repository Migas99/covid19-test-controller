import { Component, OnInit, TemplateRef } from '@angular/core';
import { covid19APIService } from 'src/app/services/covid19API.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Request } from '../classes/requests';
import { ActivatedRoute } from '@angular/router';
import * as fileSaver from 'file-saver/';
import { ShareDataService } from '../services/shareData.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup } from "@angular/forms";

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.css']
})
export class RequestsComponent implements OnInit {

  form: FormGroup;

  constructor(private covid19APIService: covid19APIService, public router: Router, private route: ActivatedRoute, public data: ShareDataService,
    private modalService: BsModalService, public fb: FormBuilder) {
    this.form = this.fb.group({
      name: [''],
      file: [null]
    })
  }

  requestInfo: Request = null;
  id: String;
  canTestResult: boolean = false;
  canDownloadFirst: boolean = false;
  canDownloadSecond: boolean = false;
  canSchedule: boolean = true;
  scheduleDate: Date;
  requestError: String = "";

  modalRef: BsModalRef;
  config = {
    animated: true
  };
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, this.config);
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
    });

    this.getRequest();
  }

  getRequest() {
    this.covid19APIService.getRequest(this.id).subscribe(
      (request: any) => {
        this.requestInfo = request;
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
    if (this.requestInfo.isInfected == null) {
      if (this.requestInfo.firstTest != null) {
        if (this.requestInfo.firstTest.result == null && this.requestInfo.firstTest.testDate != null) {
          if (this.requestInfo.firstTest.responsibleTechnicianId === this.data.currentID) {
            this.canTestResult = true;
            this.canSchedule = false;
          }
        }
        console.log(this.requestInfo.secondTest);
      }
      if (this.requestInfo.secondTest != null) {
        if (this.requestInfo.secondTest.result == null && this.requestInfo.secondTest.testDate) {
          if (this.requestInfo.secondTest.responsibleTechnicianId === this.data.currentID) {
            this.canTestResult = true;
            this.canSchedule = false;
          }
        }
      }
    } else {
      this.canTestResult = false;
      this.canSchedule = false;
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

  addTestResult() {
    var formData: any = new FormData();
    formData.append("result", this.form.get('name').value);
    formData.append("file", this.form.get('file').value);
    console.log(this.form.get('name').value);
    this.covid19APIService.addTestResult(formData, this.requestInfo._id).subscribe(
      (answer: any) => {
        this.getRequest();
        this.modalRef.hide();
        this.requestError = "";
      },
      (err: HttpErrorResponse) => {
        if (err.error === "Not authorized!") {
          this.modalRef.hide();
          alert("NÃO TEM PERMISSÃO PARA ACEDER A ESSA FUNCIONALIDADE");
          this.router.navigate(['/home']);
        };
        console.log(err.error.Error);
        this.requestError = err.error.Error;
      }
    );
  }

  scheduleTest(date: Date) {
    this.covid19APIService.scheduleTest(date, this.requestInfo._id).subscribe(
      (answer: any) => {
        this.getRequest();
        this.modalRef.hide();
      },
      (err: HttpErrorResponse) => {
        if (err.error === "Not authorized!") {
          this.modalRef.hide();
          alert("NÃO TEM PERMISSÃO PARA ACEDER A ESSA FUNCIONALIDADE");
          this.router.navigate(['/home']);
        };
        console.log(err.error.Error);
        this.requestError = err.error.Error;
      }
    );
  }

  uploadFile(event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({
      file: file
    });
    this.form.get('file').updateValueAndValidity()
  }
}
