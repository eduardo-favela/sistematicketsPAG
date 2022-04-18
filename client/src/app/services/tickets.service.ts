import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import API_URI from './API_URI'

@Injectable({
  providedIn: 'root'
})
export class TicketsService {

  constructor(private http: HttpClient) { }

  setTicket(ticket){
    return this.http.post(`${API_URI}/tickets/setTicket`,ticket)
  }

  getTicketsForTable(fechas){
    return this.http.post(`${API_URI}/tickets/getTicketsForTable`, fechas)
  }

  geEstatusTickets(){
    return this.http.get(`${API_URI}/tickets/geEstatusTickets`)
  }

  getSeguimientosTicket(ticket){
    return this.http.post(`${API_URI}/tickets/getSeguimientosTicket`, ticket)
  }

  setCommentsFecha(comentarios){
    return this.http.post(`${API_URI}/tickets/setCommentsFecha`,comentarios)
  }

  setSeguimiento(seguimiento){
    return this.http.post(`${API_URI}/tickets/setSeguimiento`,seguimiento)
  }

  ticketSolucionado(ticket){
    return this.http.post(`${API_URI}/tickets/ticketSolucionado`,ticket)
  }

  downloadexcelfile(reportes){
    return this.http.post(`${API_URI}/reportes/downloadexcel`,reportes,{responseType:'blob'})
  }
}
