import { Component, OnInit, TemplateRef } from '@angular/core';
import { covid19APIService } from 'src/app/services/covid19API.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Users } from '../classes/users';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(private covid19APIService : covid19APIService, private router : Router, private route:ActivatedRoute, private _location: Location, 
    private modalService: BsModalService) { }
    
    modalRef: BsModalRef;
    config = {
      animated: true
    };
    openModal(template: TemplateRef<any>) {
      this.modalRef = this.modalService.show(template, this.config);
    }

  username:String = "";
  deleteErro:String = "";
  userInfo = new Users();
  id:String;

  ngOnInit(): void {
    if(this.router.url === "/profile"){
      this.covid19APIService.getProfile().subscribe(
        (user : any)=>{
          this.userInfo = user;
        },
        (err : HttpErrorResponse) =>{
          console.log(err);
        }
      );
    }
    else{
      this.route.paramMap.subscribe(params => {
          this.id = params.get('id');
      });

      this.covid19APIService.getUser(this.id).subscribe(
        (user : any)=>{
          this.userInfo = user;
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

  deleteUser(){
    if(this.username === this.userInfo.username){
      this.covid19APIService.deleteUser(this.id).subscribe(
        (user : any)=>{
          this.modalRef.hide();
          this._location.back();
          alert("REMOVIDO COM SUCESSO");
        },
        (err : HttpErrorResponse) =>{
          if(err.error === "Not authorized!"){
            alert("NÃO TEM PERMISSÃO PARA ACEDER A ESSA FUNCIONALIDADE");
          };
          console.log(err);
        }
      );
    }
    else{
      this.deleteErro = "NANAO";
    }
  }
}
