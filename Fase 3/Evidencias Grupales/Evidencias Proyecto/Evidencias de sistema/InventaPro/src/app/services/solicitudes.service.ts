import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Solicitud, SolicitudCU } from '../interfaces/solicitud';
import { Producto } from '../interfaces/producto';

@Injectable({
  providedIn: 'root'
})
export class SolicitudesService {

  apiUrl = environment.api + 'Solicitudes';

  httpClient = inject(HttpClient);

  constructor() { }

  async getAllByIdBodega(id: number){
    try {
      const req = await lastValueFrom(this.httpClient.get<Solicitud[]>(`${this.apiUrl}/SolicitudesByIdBodega/${id}`));
       return req;
    } catch (error) {
      throw error;
    }
  }

  async getAllByIdBodegaForTransferencia(id: number){
    try {
      const req = await lastValueFrom(this.httpClient.get<{cantidad: number, productoId: number}[]>(`${this.apiUrl}/SolicitudesByIdBodegaForTransferencia/${id}`));
       return req;
    } catch (error) {
      throw error;
    }
  }

  async getOneByIdSolicitud(id: number){
    try {
      const req = await lastValueFrom(this.httpClient.get<Solicitud>(`${this.apiUrl}/SolicitudByIdSolicitud/${id}`));
       return req;
    } catch (error) {
      throw error;
    }
  }

  async getOpciones(idBodega: number){
    try {
      const req = await lastValueFrom(this.httpClient.get<Producto[]>(`${this.apiUrl}/Opciones/${idBodega}`));
       return req;
    } catch (error) {
      throw error;
    }
  }

  async CuPost(data: SolicitudCU){
    try {
      const req = await lastValueFrom(this.httpClient.post(`${this.apiUrl}`, data));
       return req;
    } catch (error) {
      throw error;
    }
  }

  async cancelar(id: number){
    try {
      const req = await lastValueFrom(this.httpClient.get(`${this.apiUrl}/Cancel/${id}`));
       return req;
    } catch (error) {
      throw error;
    }
  }
  
  async acceptDeny(body: 
    {solicitudId: number, accept: boolean, observacion: string, detalles: {detalleId: number, cantidad: number}[] }
  ){
    try {
      const req = await lastValueFrom(this.httpClient.post(`${this.apiUrl}/AcceptDeny`, body));
       return req;
    } catch (error) {
      throw error;
    }
  }

}
