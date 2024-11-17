import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Compra, CompraC } from '../interfaces/compra';
import { Distribuidor } from '../interfaces/distribuidor';

@Injectable({
  providedIn: 'root'
})
export class ComprasService {

  apiUrl = environment.api + 'Compras';

  httpClient = inject(HttpClient);

  constructor() { }

  async getAll(){
    try {
      const req = await lastValueFrom(this.httpClient.get<Compra[]>(`${this.apiUrl}`));
      return req;
    } catch (error) {
      throw error;
    }
  }

  async getOne(compraId: number){
    try {
      const req = await lastValueFrom(this.httpClient.get<Compra>(`${this.apiUrl}/${compraId}`));
      return req;
    } catch (error) {
      throw error;
    }
  }

  async getOptions(){
    try {
      const req = await lastValueFrom(this.httpClient.get<Distribuidor[]>(`${this.apiUrl}/Options`));
      return req;
    } catch (error) {
      throw error;
    }
  }

  async create(body: CompraC){
    try {
      const req = await lastValueFrom(this.httpClient.post(`${this.apiUrl}`, body));
      return req;
    } catch (error) {
      throw error;
    }
  }

  async cancel(compraId: number){
    try {
      const req = await lastValueFrom(this.httpClient.get(`${this.apiUrl}/Cancel/${compraId}`));
      return req;
    } catch (error) {
      throw error;
    }
  }

}
