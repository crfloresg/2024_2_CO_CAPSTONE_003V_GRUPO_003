import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Dashboard } from '../interfaces/dashboard';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  apiUrl = environment.api + 'Dashboard';

  httpClient = inject(HttpClient);

  constructor() { }

  async getPerdidas(bodegaId: number){
    try {
      const req = await lastValueFrom(this.httpClient.get<Dashboard[]>(`${this.apiUrl}/Perdidas/${bodegaId}`));
      return req;
    } catch (error) {
      throw error;
    }
  }

  async getSolicitados(bodegaId: number){
    try {
      const req = await lastValueFrom(this.httpClient.get<Dashboard[]>(`${this.apiUrl}/Solicitados/${bodegaId}`));
      return req;
    } catch (error) {
      throw error;
    }
  }

  async getTransferidos(bodegaId: number){
    try {
      const req = await lastValueFrom(this.httpClient.get<Dashboard[]>(`${this.apiUrl}/Transferidos/${bodegaId}`));
      return req;
    } catch (error) {
      throw error;
    }
  }

}
