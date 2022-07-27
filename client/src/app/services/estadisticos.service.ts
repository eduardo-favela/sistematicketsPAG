import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import API_URI from './API_URI'

@Injectable({
  providedIn: 'root'
})
export class EstadisticosService {

  constructor(private http: HttpClient) { }

  getStatistics(fechas) {
    return this.http.post(`${API_URI}/estadisticos/getStatistics`, fechas)
  }

  getStatsTipoServicio(fechas) {
    return this.http.post(`${API_URI}/estadisticos/getStatsTipoServicio`, fechas)
  }

  getStatsActividad(fechas) {
    return this.http.post(`${API_URI}/estadisticos/getStatsActividad`, fechas)
  }
}
