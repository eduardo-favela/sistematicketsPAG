import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import API_URI from './API_URI'

@Injectable({
  providedIn: 'root'
})
export class EquipoSistemasService {

  constructor(private http: HttpClient) { }

  getEquipoSistemas(){
    return this.http.get(`${API_URI}/equipoSistemas/getEquipoSistemas`)
  }
}
