import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Bodega } from '../interfaces/bodega';

@Injectable({
  providedIn: 'root'
})
export class BodegasService {

  apiUrl = environment.api + 'Bodegas';

  httpClient = inject(HttpClient);

  constructor() { }

  async getAll(){
    try {
      const req = await lastValueFrom(this.httpClient.get<Bodega[]>(`${this.apiUrl}`));
       return req;
    } catch (error) {
      throw error;
    }
  }

}
