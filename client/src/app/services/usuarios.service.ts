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
}
