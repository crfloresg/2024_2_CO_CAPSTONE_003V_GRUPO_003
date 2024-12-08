import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Rol } from '../interfaces/rol';
import { Bodega } from '../interfaces/bodega';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  apiUrl = environment.api + 'Roles';

  httpClient = inject(HttpClient);

  constructor() { }

  async getAll(){
    try {
      const req = await lastValueFrom(this.httpClient.get<Rol[]>(`${this.apiUrl}`));
       return req;
    } catch (error) {
      throw error;
    }
  }

  async getById(id: number){
    try {
      const req = await lastValueFrom(this.httpClient.get<Rol>(`${this.apiUrl}/${id}`));
       return req;
    } catch (error) {
      throw error;
    }
  }

  async getOpciones(){
    try {
      const req = await lastValueFrom(this.httpClient.get<Bodega[]>(`${this.apiUrl}/Opciones`));
       return req;
    } catch (error) {
      throw error;
    }
  }

  async CuPost(data: Rol){
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
