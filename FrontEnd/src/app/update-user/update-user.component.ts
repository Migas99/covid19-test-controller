import { Component, OnInit } from '@angular/core';
import { covid19APIService } from 'src/app/services/covid19API.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css']
})
export class UpdateUserComponent implements OnInit {

  constructor(private covid19APIService : covid19APIService, private router : Router, private route:ActivatedRoute, private _location: Location) { }

  ngOnInit(): void {
  }

  obj:any = {}
  password:String;
  email:String;
  phoneNumber:Number;
  address:String;
  id:String;
  erro:String = "";


  updateUser(){
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
    });

    this.criarObject();
    
    this.covid19APIService.updateUser(this.obj, this.id).subscribe(
      (user : any)=>{
        this.erro = "";
        this._location.back();
        alert("ATUALIZADO COM SUCESSO");
      },
      (err : HttpErrorResponse) =>{
        if(err.error === "Not authorized!"){
          alert("NÃO TEM PERMISSÃO PARA ACEDER A ESSA FUNCIONALIDADE");
        };
        this.erro = err.error;
        console.log(err);
      }
    );
  }

  cancelar(){
    this._location.back();
  }

  criarObject(){
    if(this.password){
      this.obj.password = this.password;
    }
    if(this.email){
      this.obj.email = this.email;
    }
    if(this.phoneNumber){
      this.obj.phoneNumber = this.phoneNumber;
    }
    if(this.address){
      this.obj.address = this.address;
    }
  }
}
