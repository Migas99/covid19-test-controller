import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Users } from '../classes/users';
import { Observable } from "rxjs";

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class covid19APIService {

    constructor(private httpclient: HttpClient) { }

    url: String = "http://localhost:3000/";

    //Login
    login(username: String, password: String): Observable<any> {
        const credenciais = { "username": username, "password": password };
        return this.httpclient.post(this.url + "users/login", credenciais, httpOptions);
    }

    //Registo
    register(user: Users): Observable<any> {
        return this.httpclient.post(this.url + "users/register", user);
    }

    //Registar funcionario
    registerTechnician(user: Users): Observable<any> {
        return this.httpclient.post(this.url + "users/technician/register", user);
    }

    //Perfil do utilizador com sessao iniciada
    getProfile() {
        return this.httpclient.get(this.url + "users/profile");
    }

    //lista de utilizadores
    getUsersList(): Observable<any> {
        return this.httpclient.get(this.url + "users");
    }

    //lista de tecnicos
    getTechniciansList(): Observable<any> {
        return this.httpclient.get(this.url + "users/technicians");
    }

    //lista de utilizadores infetados
    getInfectedUsers(): Observable<any> {
        return this.httpclient.get(this.url + "users/infected");
    }

    //utilizador dado id
    getUser(id: String): Observable<any> {
        return this.httpclient.get(this.url + "users/" + id);
    }

    //atualizar utilizador
    updateUser(obj: any, id: String): Observable<any> {
        return this.httpclient.put(this.url + "users/" + id, obj);
    }
    //eliminar utilizador
    deleteUser(id: String): Observable<any> {
        return this.httpclient.delete(this.url + "users/" + id);
    }

    //lista de pedidos tradados
    handledRequests(): Observable<any> {
        return this.httpclient.get(this.url + "requests/getCompletedRequests");
    }

    //lista de pedidos por tratar
    unhandledRequests(): Observable<any> {
        return this.httpclient.get(this.url + "requests/getIncompletedRequests/date");
    }

    //lista de pedidos que um tecnico tem de tratar
    technicianRequests(): Observable<any> {
        return this.httpclient.get(this.url + "requests/getIncompletedRequests/result");
    }

    //lista de pedidos de um utilizador
    myRequests(): Observable<any> {
        return this.httpclient.get(this.url + "requests/myrequests");
    }

    //ober um request
    getRequest(id: String): Observable<any> {
        return this.httpclient.get(this.url + "requests/request/" + id);
    }

    //download Test
    downloadTest(filePath: String): Observable<any> {
        return this.httpclient.post(this.url + "requests/download", { filePath: filePath }, {
            responseType: "blob",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/pdf"
            }
        });
    }
};