import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { User } from "../models/user.model";

@Injectable({providedIn: 'root'})
export class AuthService
{
    private baseUrl : string = '/api/auth';

    constructor(private http: HttpClient){}

    registerUser(user : User) : Observable<User>{
        return this.http.post<User>(`${this.baseUrl}/register`, user);
    }

    loginUser(user : User) : Observable<User>{
        return this.http.post<User>(`${this.baseUrl}/login`, user);
    }
}