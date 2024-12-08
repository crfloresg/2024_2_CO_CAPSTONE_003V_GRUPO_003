import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Bodega, BodegaCU } from '../interfaces/bodega';

@Injectable({
  providedIn: 'root'
})
export class BodegasService {

  apiUrl = environment.api + 'Bodegas';

  httpClient = inject(HttpClient);

  constructor() { }

  async getAll(){
    try {
      const req = await lastValueFrom(this.httpClient.get<Bodega[]>(`${this.apiUrl}`));
       return req;
    } catch (error) {
      throw error;
    }
  }

  async getAllForCrud(){
    try {
      const req = await lastValueFrom(this.httpClient.get<Bodega[]>(`${this.apiUrl}/GetAll`));
       return req;
    } catch (error) {
      throw error;
    }
  }

  async getById(bodegaId: number){
    try {
      const req = await lastValueFrom(this.httpClient.get<Bodega>(`${this.apiUrl}/${bodegaId}`));
       return req;
    } catch (error) {
      throw error;
    }
  }

  async CU(body: BodegaCU){
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
