import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient,HttpParams } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Alerta, UpdateAlerta, TipoAlerta, EstadoAlerta, AlertaCu } from '../interfaces/alerta';

@Injectable({
  providedIn: 'root'
})
export class AlertaService {

  apiUrl = environment.informeApi;

  httpClient = inject(HttpClient);

  constructor() { }

  async getAll(id: number){
    try {
      const req = await lastValueFrom(this.httpClient.get<Alerta[]>(`${this.apiUrl}/AlertaLote/${id}`));
      console.log(req)
       return req;
    } catch (error) {
      throw error;
    }
  }

  async delete(id: number){
    try {
      const req = await lastValueFrom(this.httpClient.get(`${this.apiUrl}/UpdateAlert/${id}/1/3/2`));
       return req;
    } catch (error) {
      throw error;
    }
  }

  async activate(id: number){
    try {
      const req = await lastValueFrom(this.httpClient.get(`${this.apiUrl}/UpdateAlert/${id}/1/1/2`));
       return req;
    } catch (error) {
      throw error;
    }
  }

  async updateStockMin(id: number){
    try {
      const req = await lastValueFrom(this.httpClient.get(`${this.apiUrl}/UpdateAlert/${id}/1/1/1`));
       return req;
    } catch (error) {
      throw error;
    }
  }

  async getAlertById(id: number){
    try {
      const req = await lastValueFrom(this.httpClient.get<Alerta>(`${this.apiUrl}/OneAlert/${id}`));
       return req;
    } catch (error) {
      throw error;
    }
  }

  async CuPost(data: AlertaCu){
    try {
      const req = await lastValueFrom(this.httpClient.post(`${this.apiUrl}/UpdateStock`, data));
       return req;
    } catch (error) {
      throw error;
    }
  }

  async getAllAlertas(bodegaId: number){
    try {
      const req = await lastValueFrom(this.httpClient.get<Alerta[]>(`${this.apiUrl}/StockAlerta/${bodegaId}`));
      console.log(req)
       return req;
    } catch (error) {
      throw error;
    }
  }
}
