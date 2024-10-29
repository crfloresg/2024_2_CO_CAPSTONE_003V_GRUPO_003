import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Usuario, UsuarioCU } from '../interfaces/usuario';
import { Rol } from '../interfaces/rol';
import { Bodega } from '../interfaces/bodega';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  apiUrl = environment.api + 'Usuarios';

  httpClient = inject(HttpClient);

  constructor() { }

  async getAll(){
    try {
      const req = await lastValueFrom(this.httpClient.get<Usuario[]>(`${this.apiUrl}`));
       return req;
    } catch (error) {
      throw error;
    }
  }

  async getById(id: number){
    try {
      const req = await lastValueFrom(this.httpClient.get<Usuario>(`${this.apiUrl}/${id}`));
       return req;
    } catch (error) {
      throw error;
    }
  }

  async getOpciones(){
    try {
      const req = await lastValueFrom(this.httpClient.get<{roles: Rol[], bodegas: Bodega[]}>(`${this.apiUrl}/Opciones`));
       return req;
    } catch (error) {
      throw error;
    }
  }

  async CU(usuario: UsuarioCU){
    try {
      const req = await lastValueFrom(this.httpClient.post(`${this.apiUrl}`, usuario));
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
