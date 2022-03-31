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

  getServiciosTable(){
    return this.http.get(`${API_URI}/servicios/getServiciosTable`)
  }

  getDeptosSistemas(){
    return this.http.get(`${API_URI}/servicios/getDeptosSistemas`)
  }

  getTiposServicio(servicio){
    return this.http.post(`${API_URI}/servicios/getTiposServicios`,servicio)
  }

  getTiposServicioTable(){
    return this.http.get(`${API_URI}/servicios/getTiposServicioTable`)
  }

  setServicio(servicio){
    return this.http.post(`${API_URI}/servicios/setServicio`,servicio)
  }

  updateServicio(servicio){
    return this.http.post(`${API_URI}/servicios/updateServicio`,servicio)
  }

  setTipoServicio(tiposervicio){
    return this.http.post(`${API_URI}/servicios/setTipoServicio`,tiposervicio)
  }

  updateTipoServicio(tiposervicio){
    return this.http.post(`${API_URI}/servicios/updateTipoServicio`,tiposervicio)
  }

  unsetTipoServicio(tiposervicio){
    return this.http.post(`${API_URI}/servicios/unsetTipoServicio`,tiposervicio)
  }

  getTiposServicioAsignados(servicio){
    return this.http.post(`${API_URI}/servicios/getTiposServicioAsignados`,servicio)
  }

  setServicioHTS(serviciohts){
    return this.http.post(`${API_URI}/servicios/setServicioHTS`,serviciohts)
  }
}
