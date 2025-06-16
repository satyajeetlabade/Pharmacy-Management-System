import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Drug } from "../models/drug.model";
import { Injectable } from "@angular/core";

@Injectable({providedIn: 'root'})
export class DrugService
{
    private baseUrl : string = '/api/drug';
    
    constructor(private http : HttpClient){}

    getAll() : Observable<Drug[]>{
        return this.http.get<Drug[]>(this.baseUrl);
    }

    getById(id:number): Observable<Drug>{
        return this.http.get<Drug>(`${this.baseUrl}/${id}`);
    }

    create(drug : Drug): Observable<Drug>{
        return this.http.post<Drug>(this.baseUrl, drug)
    }

    update(drugId: number, drug: Drug) : Observable<Drug>{
        return this.http.put<Drug>(`${this.baseUrl}/${drugId}`, drug);
    }

    delete(id: number): Observable<Drug>{   
        return this.http.delete<Drug>(`${this.baseUrl}/${id}`);
    }

}
