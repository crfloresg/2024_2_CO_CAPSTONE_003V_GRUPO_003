import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Permiso } from '../interfaces/permiso';

@Injectable({
  providedIn: 'root'
})
export class PermisosService {

  apiUrl = environment.api + 'Permisos';

  httpClient = inject(HttpClient);

  constructor() { }

  async getAll(){
    try {
      const req = await lastValueFrom(this.httpClient.get<Permiso[]>(`${this.apiUrl}`));
       return req;
    } catch (error) {
      throw error;
    }
  }

}
