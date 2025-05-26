import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Supplier } from "../models/supplier.model";

@Injectable({
    providedIn: 'root'
})
export class SupplierService{
    private baseUrl = 'api/supplier';

    constructor(private http: HttpClient){}

    getSuppliers() : Observable<Supplier[]> {
        return this.http.get<Supplier[]>(this.baseUrl);
    }

    getSupplierById(id:number) : Observable<Supplier>{
        return this.http.get<Supplier>(`${this.baseUrl}/${id}`);
    }

    createSupplier(supplier: Supplier): Observable<void>{
        return this.http.post<void>(`${this.baseUrl}`,supplier);
    }

     updateSupplier(id: number, supplier: Supplier): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, supplier);
  }

  deleteSupplier(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}