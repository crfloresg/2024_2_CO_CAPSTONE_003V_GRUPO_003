import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Distribuidor, DistribuidorCU } from '../interfaces/distribuidor';

@Injectable({
  providedIn: 'root'
})
export class DistribuidoresService {

  apiUrl = environment.api + 'Distribuidores';

  httpClient = inject(HttpClient);

  constructor() { }

  async getAll(){
    try {
      const req = await lastValueFrom(this.httpClient.get<Distribuidor[]>(`${this.apiUrl}`));
       return req;
    } catch (error) {
      throw error;
    }
  }

  async getById(distribuidorId: number){
    try {
      const req = await lastValueFrom(this.httpClient.get<Distribuidor>(`${this.apiUrl}/${distribuidorId}`));
       return req;
    } catch (error) {
      throw error;
    }
  }

  async CU(body: DistribuidorCU){
    try {
      const req = await lastValueFrom(this.httpClient.post(`${this.apiUrl}`, body));
       return req;
    } catch (error) {
      throw error;
    }
  }

  async delete(id: number){
    try {
      const req = await lastValueFrom(this.httpClient.get(`${this.apiUrl}/Delete/${id}`));
       return req;
    } catch (error) {
      throw error;
    }
  }

  async activate(id: number){
    try {
      const req = await lastValueFrom(this.httpClient.get(`${this.apiUrl}/Activate/${id}`));
       return req;
    } catch (error) {
      throw error;
    }
  }

}
