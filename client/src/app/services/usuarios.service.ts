import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import API_URI from './API_URI'

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  constructor(private http: HttpClient) { }

  getUsuarios(){
    return this.http.get(`${API_URI}/usuarios/getUsuarios`)
  }

  getTiposUsuarios(){
    return this.http.get(`${API_URI}/usuarios/getTiposUsuario`)
  }

  getUens(){
    return this.http.get(`${API_URI}/usuarios/getUens`)
  }

  getPuestos(){
    return this.http.get(`${API_URI}/usuarios/getPuestos`)
  }

  getDeptos(){
    return this.http.get(`${API_URI}/usuarios/getDeptos`)
  }

  setColaborador(colaborador){
    return this.http.post(`${API_URI}/usuarios/setColaborador`, colaborador)
  }

  updateColaborador(colaborador){
    return this.http.post(`${API_URI}/usuarios/updateColaborador`, colaborador)
  }

  disableColab(colaborador){
    return this.http.post(`${API_URI}/usuarios/disableColab`, colaborador)
  }
}
