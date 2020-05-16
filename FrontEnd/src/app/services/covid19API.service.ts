import { Injectable} from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Users } from '../classes/users';
import { Observable } from "rxjs";

@Injectable()
export class covid19APIService{

    constructor(private httpclient: HttpClient){}

    login(username:String, password:String){
        const credenciais = {"username":username, "password":password};
        return this.httpclient.post("http://localhost:3000/users/login", credenciais);
    }

    register(user:Users){
        return this.httpclient.post("http://localhost:3000/users/register", user, {responseType: 'text'});
    }
};