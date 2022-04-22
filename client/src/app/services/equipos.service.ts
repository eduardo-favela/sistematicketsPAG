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

  getEquiposTable(){
    return this.http.get(`${API_URI}/equipos/getEquiposTable`)
  }

  getTiposEquipos(){
    return this.http.get(`${API_URI}/equipos/getTiposEquipos`)
  }

  getMarcasEquipos(){
    return this.http.get(`${API_URI}/equipos/getMarcasEquipos`)
  }

  setEquipo(equipo){
    return this.http.post(`${API_URI}/equipos/setEquipo`, equipo)
  }

  updateEquipo(equipo){
    return this.http.post(`${API_URI}/equipos/updateEquipo`, equipo)
  }

  deleteEquipo(equipo){
    return this.http.post(`${API_URI}/equipos/deleteEquipo`, equipo)
  }
}
