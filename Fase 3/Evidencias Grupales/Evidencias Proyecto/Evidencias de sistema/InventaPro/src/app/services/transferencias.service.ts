import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { RecepcionCreate, Transferencia, TransferenciaCreate } from '../interfaces/transferencia';

@Injectable({
  providedIn: 'root'
})
export class TransferenciasService {

  apiUrl = environment.api + 'Transferencias';

  httpClient = inject(HttpClient);

  constructor() { }

  async getAllByBodegaId(bodegaId: number){
    try {
      const req = await lastValueFrom(this.httpClient.get<Transferencia[]>(`${this.apiUrl}/${bodegaId}`));
      return req;
    } catch (error) {
      throw error;
    }
  }

  async getOne(trasnferenciaId: number){
    try {
      const req = await lastValueFrom(this.httpClient.get<Transferencia>(`${this.apiUrl}/Detalle/${trasnferenciaId}`));
      return req;
    } catch (error) {
      throw error;
    }
  }

  async getOneForRecepcion(trasnferenciaId: number, secret: number){
    try {
      const req = await lastValueFrom(this.httpClient.get<Transferencia>(`${this.apiUrl}/Recepcion/${trasnferenciaId}/${secret}`));
      return req;
    } catch (error) {
      throw error;
    }
  }

  async create(body: TransferenciaCreate){
    try {
      const req = await lastValueFrom(this.httpClient.post(`${this.apiUrl}`, body));
      return req;
    } catch (error) {
      throw error;
    }
  }

  async recepcion(body: RecepcionCreate){
    try {
      const req = await lastValueFrom(this.httpClient.post(`${this.apiUrl}/Recepcion`, body));
      return req;
    } catch (error) {
      throw error;
    }
  }


  async cancel(transferenciaId: number){
    try {
      const req = await lastValueFrom(this.httpClient.get(`${this.apiUrl}/Cancel/${transferenciaId}`));
      return req;
    } catch (error) {
      throw error;
    }
  }
  
  async SolicitudDetails(solicitudId: number){
    try {
      const req = await lastValueFrom(this.httpClient.get<number>(`${this.apiUrl}/SolicitudDetails/${solicitudId}`));
      return req;
    } catch (error) {
      throw error;
    }
  }
  

}
