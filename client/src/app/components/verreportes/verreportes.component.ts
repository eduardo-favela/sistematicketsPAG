import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import * as FileSaver from 'file-saver'
import { Subject } from 'rxjs';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';

import { TicketsService } from 'src/app/services/tickets.service';

@Component({
  selector: 'app-verreportes',
  templateUrl: './verreportes.component.html',
  styleUrls: ['./verreportes.component.css']
})
export class VerreportesComponent implements OnInit {

  ///////////////////////////////////VARIABLES Y PROPIEDADES GLOBALES DE LA CLASE///////////////////////////////////
  fechaRespuesta: NgbDate = new NgbDate(parseInt(moment().format('YYYY')), parseInt(moment().format('MM')), parseInt(moment().format('DD')));
  horaRespuesta = null;
  commentsnew = null
  noInfo = true
  fechaInicial: NgbDate = null
  fechaFinal: NgbDate = new NgbDate(parseInt(moment().format('YYYY')), parseInt(moment().format('MM')), parseInt(moment().format('DD')));
  estatusFilter = 0;
  sessionStorage = sessionStorage

  editingTicket: any = null

  fechaSeguimiento: NgbDate = new NgbDate(parseInt(moment().format('YYYY')), parseInt(moment().format('MM')), parseInt(moment().format('DD')));
  horaSeguimiento = null;

  seguimiento: any = {
    fecha: null,
    comentarios: null,
    tiemporesolucion: null
  }

  solucionTicket: any = 2

  estatusTickets: any = []

  ticketSelected: any = null

  constructor(private ticketsService: TicketsService) { }

  ngOnInit(): void {

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      lengthMenu: [5, 10, 25],
      processing: true,
      language: {
        url: 'https://cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json'
      },
      responsive: true
    }


    const current = new Date();
    const prior = new Date().setDate(current.getDate() - 30);
    const lastMonth = new Date(prior)
    this.fechaInicial = new NgbDate(lastMonth.getFullYear(), (lastMonth.getMonth() + 1), lastMonth.getDate());

    this.getTicketsForTable()
    this.getEstatusTickets()
  }

  ////////////////////////////////////////////////VARIABLES DE TABLA////////////////////////////////////////////////

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  dtTriggerSeg: Subject<any> = new Subject<any>();
  seguimientosTicket: any = [];
  tickets: any = [];

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  ///////////////////////////////////////////////////FUNCIONES//////////////////////////////////////////////////////

  getEstatusTickets() {
    this.ticketsService.geEstatusTickets().subscribe(
      res => {
        this.estatusTickets = res
      },
      err => {
        console.error(err)
      }
    )
  }

  cancelarCambios() {
    this.clearInputsEditModal()
  }

  downloadExcelFile() {
    let fecha = moment().format('DDMMYYYYhhmmA')
    this.ticketsService.downloadexcelfile({ reportes: this.tickets, fecha: fecha }).subscribe(
      res => {
        /* console.log(res) */
        FileSaver.saveAs(res, fecha + ".xlsx")
      },
      err => {
        console.log(err)
      }
    )
  }

  clearInputsEditModal() {
    this.fechaRespuesta = new NgbDate(parseInt(moment().format('YYYY')), parseInt(moment().format('MM')), parseInt(moment().format('DD')));
    this.horaRespuesta = { hour: parseInt(moment().format('HH')), minute: parseInt(moment().format('mm')) };
    this.commentsnew = null
  }

  getTicketsForTable() {
    let fecha1 = (moment().format(this.fechaInicial.year.toString() +
      '-' + this.fechaInicial.month.toString() +
      '-' + this.fechaInicial.day.toString()));
    let fecha2 = (moment().format(this.fechaFinal.year.toString() +
      '-' + this.fechaFinal.month.toString() +
      '-' + this.fechaFinal.day.toString()));
    this.ticketsService.getTicketsForTable({ estatus: this.estatusFilter, fecha1: fecha1, fecha2: fecha2 }).subscribe(
      res => {
        this.tickets = res
        if (this.tickets.length > 0) {
          this.noInfo = false
          this.dtTrigger.next()
        }
      },
      err => console.error(err)
    )
  }

  searchTicketsForTable() {
    this.destroyTableTickets()
    this.getTicketsForTable()
  }

  cerrarModalSegs() {
    this.destroyTableSegs()
  }

  destroyTableSegs() {
    let table = $('#tableSeguimientos').DataTable()
    table.destroy();
  }

  destroyTableTickets() {
    let table = $('#tableTickets').DataTable()
    table.destroy();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  clearInputs() {
    this.fechaInicial = new NgbDate(parseInt(moment().format('YYYY')), parseInt(moment().format('MM')), parseInt(moment().format('DD')));
    this.fechaFinal = new NgbDate(parseInt(moment().format('YYYY')), parseInt(moment().format('MM')), parseInt(moment().format('DD')));
    this.noInfo = true
  }

  onEditRptBtnClick(reporte) {
    this.horaRespuesta = { hour: parseInt(moment().format('HH')), minute: parseInt(moment().format('mm')) };
    this.editingTicket = { ...reporte }
    if(reporte.estatus_idestatus != 3){
      if (reporte.comentarios && reporte.fecha_respuesta) {
        this.horaSeguimiento = { hour: parseInt(moment().format('HH')), minute: parseInt(moment().format('mm')) };
        $('#agregaSeguimiento').modal('show')
      }
      else {
        $('#editareportemodal').modal('show')
      }
    }
    else{
      this.showModal(4, 'Ticket atendido','No se puede agregar seguimientos a este ticket, ya que está cerrado')
    }
  }

  setSeguimiento(horas, minutos) {
    minutos = ((parseFloat(minutos) == 0) ? (0) : (parseFloat(minutos) / 60))
    this.seguimiento.tiemporesolucion = (horas + '.' + ((minutos == 0) ? (minutos.toString()) : (minutos.toString().split('.')[1])));
    this.seguimiento.fecha = (moment().format(this.fechaSeguimiento.year.toString() +
      '-' + this.fechaSeguimiento.month.toString() +
      '-' + this.fechaSeguimiento.day.toString()) + ' ' + this.horaSeguimiento.hour.toString() +
      ':' + this.horaSeguimiento.minute.toString() + ':00');
    this.seguimiento.idticket = this.editingTicket.idticket
    if (this.seguimiento.fecha && this.seguimiento.comentarios && this.seguimiento.tiemporesolucion) {
      //Registrar seguimiento
      this.ticketsService.setSeguimiento(this.seguimiento).subscribe(
        res => {
          if (res) {
            this.solucionTicket = 2
            $('#solucionTicketModal').modal('show')
          }
        },
        err => {
          console.error(err)
        }
      )
      console.log(this.seguimiento)
    }
    else {
      alert('Se deben llenar todos los campos')
    }
  }

  cancelarSeguimiento() {
    $('#horasSeguimiento').val('')
    $('#minutosSeguimiento').val('')
    this.seguimiento.comentarios = null
  }

  getSeguimientos(reporte) {
    this.destroyTableSegs()
    this.ticketSelected = reporte.idticket
    if (reporte.estatus_idestatus != 1) {
      this.ticketsService.getSeguimientosTicket({idticket : this.ticketSelected}).subscribe(
        res => {
          this.seguimientosTicket = res
          if (this.seguimientosTicket.length > 0) {
            this.dtTriggerSeg.next()
            $('#verSeguimientosModal').modal('show')
          }
          else{
            this.showModal(2, 'No existen registros', 'Aún no se han registrado seguimientos a este ticket')
          }
        },
        err => console.error(err)
      )
    }
    else{
      this.showModal(2, 'No existen registros', 'Aún no se han registrado seguimientos a este ticket')
    }
  }

  setSolucionTicket() {
    console.log(this.solucionTicket)
    if (this.solucionTicket == 1) {
      this.ticketsService.ticketSolucionado(this.editingTicket).subscribe(
        res => {
          if (res) {
            $('#solucionTicketModal').modal('hide')
            this.cancelarSeguimiento()
            this.destroyTableTickets()
            this.getTicketsForTable()
            $('#agregaSeguimiento').modal('hide')
            this.showModal(3, 'Registro guardado', 'El registro se guardó correctamente')
          }
        },
        err => console.error(err)
      )
    }
    else {
      $('#solucionTicketModal').modal('hide')
      this.cancelarSeguimiento()
      this.destroyTableTickets()
      this.getTicketsForTable()
      $('#agregaSeguimiento').modal('hide')
      this.showModal(3, 'Registro guardado', 'El registro se guardó correctamente')
    }
  }

  guardarCambiosReporte() {
    if (this.commentsnew && this.fechaRespuesta) {
      this.editingTicket.fechaRespuesta = (moment().format(this.fechaRespuesta.year.toString() +
        '-' + this.fechaRespuesta.month.toString() +
        '-' + this.fechaRespuesta.day.toString()) + ' ' + this.horaRespuesta.hour.toString() +
        ':' + this.horaRespuesta.minute.toString() + ':00');
      this.editingTicket.comentarios = this.commentsnew
      this.ticketsService.setCommentsFecha(this.editingTicket).subscribe(
        res => {
          if (res) {
            this.clearInputsEditModal()
            this.destroyTableTickets()
            this.getTicketsForTable()
            $('#editareportemodal').modal('hide')
            this.showModal(3, 'Registro guardado', 'Los cambios se guardaron correctamente')
          }
        },
        err => {
          console.error(err)
        }
      )
    }
    else {
      alert('Se deben llenar todos los campos')
    }
  }

  showModal(tipo, header, text) {

    //Tipo 1 -> Error
    //Tipo 2 -> Advertencia
    //Tipo 3 -> Success

    $('#alertModal').removeClass()

    if (tipo == 1) {
      $('#alertModal').addClass('alert alert-danger')
      $('#modalText').html('<i class="mr-2 fas fa-exclamation-circle"></i>' + text);
    }
    else if (tipo == 2) {
      $('#alertModal').addClass('alert alert-warning')
      $('#modalText').html('<i class="mr-2 fa fa-exclamation-triangle" aria-hidden="true"></i>' + text);
    }
    else if(tipo==3) {
      $('#alertModal').addClass('alert alert-success')
      $('#modalText').html('<i class="mr-2 fas fa-check-circle"></i>' + text);
    }
    else if(tipo==4){
      $('#alertModal').addClass('alert alert-primary')
      $('#modalText').html('<i class="mr-2 fas fa-exclamation-circle"></i>' + text);
    }
    $('#headerModal').html(header)
    $('#advertenciaModal').modal('show')
  }
  ///////////////////////////////////////////////////FUNCIONES//////////////////////////////////////////////////////
}
