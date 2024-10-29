import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Inventario } from '../interfaces/inventario';

@Injectable({
  providedIn: 'root'
})
export class InventariosService {

  apiUrl = environment.api + 'Inventarios';

  httpClient = inject(HttpClient);

  constructor() { }

  async getByIdBodega(id: number){
    try {
      const req = await lastValueFrom(this.httpClient.get<Inventario[]>(`${this.apiUrl}/${id}`));
       return req;
    } catch (error) {
      throw error;
    }
  }

}
