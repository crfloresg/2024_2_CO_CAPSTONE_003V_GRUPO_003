import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Perdida, PerdidaCreate, TipoPerdida } from '../interfaces/perdida';

@Injectable({
  providedIn: 'root'
})
export class PerdidasService {

  apiUrl = environment.api + 'Perdidas';

  httpClient = inject(HttpClient);

  constructor() { }

  async getAllByIdBodega(id: number){
    try {
      const req = await lastValueFrom(this.httpClient.get<Perdida[]>(`${this.apiUrl}/${id}`));
       return req;
    } catch (error) {
      throw error;
    }
  }

  async getTipoPerdida(){
    try {
      const req = await lastValueFrom(this.httpClient.get<TipoPerdida[]>(`${this.apiUrl}/TipoPerdidas`));
       return req;
    } catch (error) {
      throw error;
    }
  }

  async create(body: PerdidaCreate){
    try {
      const req = await lastValueFrom(this.httpClient.post(`${this.apiUrl}`, body));
       return req;
    } catch (error) {
      throw error;
    }
  }

}
