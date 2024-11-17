import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InformesService {

  apiUrl = environment.informeApi;

  httpClient = inject(HttpClient);

  constructor() { }

  async empleadosByBodega(bodegaId: number){
    try {
      const req = await lastValueFrom(
        this.httpClient.get<{
          fileName: string,
          base64: string
        }>(
          `${this.apiUrl}/Empleados`,
          {params: new HttpParams().set('bodegaid', bodegaId)}
        )
      );
       return req;
    } catch (error) {
      throw error;
    }
  }

  async productosByBodega(bodegaId: number){
    try {
      const req = await lastValueFrom(
        this.httpClient.get<{
          fileName: string,
          base64: string
        }>(
          `${this.apiUrl}/Productos`,
          {params: new HttpParams().set('bodegaid', bodegaId)}
        )
      );
       return req;
    } catch (error) {
      throw error;
    }
  }

  async bodegas(){
    try {
      const req = await lastValueFrom(
        this.httpClient.get<{
          fileName: string,
          base64: string
        }>(
          `${this.apiUrl}/Bodega`
        )
      );
       return req;
    } catch (error) {
      throw error;
    }
  }

  async auditoria(usuId: number){
    try {
      const req = await lastValueFrom(
        this.httpClient.get<{
          fileName: string,
          base64: string
        }>(
          `${this.apiUrl}/Auditoria`,
          {params: new HttpParams().set('usuId', usuId)}
        )
      );
       return req;
    } catch (error) {
      throw error;
    }
  }

  // async perdidas(usuId: number){
  //   try {
  //     const req = await lastValueFrom(
  //       this.httpClient.get<{
  //         fileName: string,
  //         base64: string
  //       }>(
  //         `${this.apiUrl}/Perdida`,
  //         {params: new HttpParams().set('usuId', usuId).set('tipoperdida')}
  //       )
  //     );
  //      return req;
  //   } catch (error) {
  //     throw error;
  //   }
  // }


  async transferenciaDetalle(transferenciaId: number){
    try {
      const req = await lastValueFrom(
        this.httpClient.get<{
          fileName: string,
          base64: string
        }>(
          `${this.apiUrl}/Transferencia`,
          {params: new HttpParams().set('IdTransferencia', transferenciaId)}
        )
      );
       return req;
    } catch (error) {
      throw error;
    }
  }

  async compraDetalle(compraId: number){
    try {
      const req = await lastValueFrom(
        this.httpClient.get<{
          fileName: string,
          base64: string
        }>(
          `${this.apiUrl}/DetalleCompra/${compraId}`,
        )
      );
       return req;
    } catch (error) {
      throw error;
    }
  }

}
