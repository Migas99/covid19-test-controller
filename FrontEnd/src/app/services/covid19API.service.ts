import { Injectable} from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Users } from '../classes/users';
import { Observable } from "rxjs";

const httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable()
export class covid19APIService{

    constructor(private httpclient: HttpClient){}

    login(username:String, password:String) : Observable<any>{
        const credenciais = {"username":username, "password":password};
        return this.httpclient.post("http://localhost:3000/users/login", credenciais, httpOptions);
    }

    register(user:Users) : Observable<any>{
        return this.httpclient.post("http://localhost:3000/users/register", user, {responseType: 'text'});
    }

    logout() : Observable<any>{
        return this.httpclient.post("http://localhost:3000/users/logout", {});
    }

    getProfile() : Observable<any>{
        return this.httpclient.get("http://localhost:3000/users/profile");
    }
};