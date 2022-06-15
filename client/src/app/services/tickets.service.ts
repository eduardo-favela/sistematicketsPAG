import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import API_URI from './API_URI'
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TicketsService {

  constructor(private http: HttpClient) { }

  private data = new BehaviorSubject('0');
  data$ = this.data.asObservable();

  changeData(data: string) {
    this.data.next(data)
  }

  setTicket(ticket){
    return this.http.post(`${API_URI}/tickets/setTicket`,ticket)
  }

  getTicketsOpen(usuario){
    return this.http.post(`${API_URI}/tickets/getTicketsOpen`,usuario)
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
    return this.http.post(`${API_URI}/tickets/downloadExcelFile`,reportes,{responseType:'blob'})
  }
}
