import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Producto, ProductoCU } from '../interfaces/producto';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  apiUrl = environment.api + 'Productos';

  httpClient = inject(HttpClient);

  constructor() { }

  async getAll(){
    try {
      const req = await lastValueFrom(this.httpClient.get<Producto[]>(`${this.apiUrl}`));
       return req;
    } catch (error) {
      throw error;
    }
  }

  async getById(id: number){
    try {
      const req = await lastValueFrom(this.httpClient.get<Producto>(`${this.apiUrl}/${id}`));
       return req;
    } catch (error) {
      throw error;
    }
  }

  async CuPost(data: ProductoCU){
    try {
      const req = await lastValueFrom(this.httpClient.post(`${this.apiUrl}`, data));
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
