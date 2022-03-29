import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import API_URI from './API_URI'

@Injectable({
  providedIn: 'root'
})
export class EquiposService {

  constructor(private http: HttpClient) { }

  getEquipos(usuario){
    return this.http.post(`${API_URI}/equipos/getEquipos`,usuario)
  }
}
