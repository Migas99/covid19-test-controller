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

    //Login
    login(username:String, password:String) : Observable<any>{
        const credenciais = {"username":username, "password":password};
        return this.httpclient.post("http://localhost:3000/users/login", credenciais, httpOptions);
    }

    //Registo
    register(user:Users) : Observable<any>{
        return this.httpclient.post("http://localhost:3000/users/register", user, {responseType: 'text'});
    }

    // logout() : Observable<any>{
    //     return this.httpclient.post("http://localhost:3000/users/logout", {});
    // }

    //Perfil do utilizador com sessao iniciada
    getProfile() : Observable<any>{
        return this.httpclient.get("http://localhost:3000/users/profile");
    }

    //lista de utilizadores
    getUsersList() : Observable<any>{
        return this.httpclient.get("http://localhost:3000/users");
    }

    //lista de tecnicos
    getTechniciansList() : Observable<any>{
        return this.httpclient.get("http://localhost:3000/users/technicians");
    }

    //lista de tecnicos
    getInfectedUsers() : Observable<any>{
        return this.httpclient.get("http://localhost:3000/users/infected");
    }

    //utilizador dado id
    getUser(id:String) :  Observable<any>{
        return this.httpclient.get("http://localhost:3000/users/"+ id);
    }
};