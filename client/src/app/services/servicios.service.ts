import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import API_URI from './API_URI'

@Injectable({
  providedIn: 'root'
})
export class ServiciosService {

  constructor(private http: HttpClient) { }

  getServicios(){
    return this.http.get(`${API_URI}/servicios/getServicios`)
  }

  getDeptosSistemas(){
    return this.http.get(`${API_URI}/servicios/getDeptosSistemas`)
  }

  getTiposServicio(servicio){
    return this.http.post(`${API_URI}/servicios/getTiposServicios`,servicio)
  }

  setServicio(servicio){
    return this.http.post(`${API_URI}/servicios/setServicio`,servicio)
  }
}
