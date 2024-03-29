import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';
import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx';
import { Subject } from 'rxjs';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';

import { TicketsService } from 'src/app/services/tickets.service';
import { EquipoSistemasService } from 'src/app/services/equipo-sistemas.service';

@Component({
  selector: 'app-verreportes',
  templateUrl: './verreportes.component.html',
  styleUrls: ['./verreportes.component.css']
})
export class VerreportesComponent implements OnInit {

  ///////////////////////////////////VARIABLES Y PROPIEDADES GLOBALES DE LA CLASE///////////////////////////////////
  fechaRespuesta: NgbDate = null
  horaRespuesta = null;
  commentsnew = null
  noInfo = true
  fechaInicial: NgbDate = null
  fechaFinal: NgbDate = new NgbDate(parseInt(moment().format('YYYY')), parseInt(moment().format('MM')), parseInt(moment().format('DD')));
  estatusFilter = 0;
  esistemasFilter = 0;
  sessionStorage = sessionStorage

  editingTicket: any = null

  fechaSeguimiento: NgbDate = null
  horaSeguimiento = null;

  seguimiento: any = {
    fecha: null,
    comentarios: null,
    tiemporesolucion: null
  }

  solucionTicket: any = 1

  estatusTickets: any = []

  equipoSistemas: any = []

  ticketSelected: any = null

  cantidadTA: any = null;

  constructor(private ticketsService: TicketsService, private equipoSistemasService: EquipoSistemasService) { }

  ngOnInit(): void {

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      lengthMenu: [5, 10, 25],
      processing: true,
      language: {
        url: 'https://cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json'
      },
      columnDefs: [
        { targets: '_all', width: '20%' }
      ]
    }

    const current = new Date();
    const prior = new Date().setDate(current.getDate() - 30);
    const lastMonth = new Date(prior)
    this.fechaInicial = new NgbDate(lastMonth.getFullYear(), (lastMonth.getMonth() + 1), lastMonth.getDate());

    this.getTicketsForTable()
    this.getEstatusTickets()
    this.getEquipoSistemas()
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

  getEquipoSistemas() {
    this.equipoSistemasService.getEquipoSistemasFilter({ depto: parseInt(sessionStorage.getItem('depto')) }).subscribe(
      res => {
        this.equipoSistemas = res
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
    let fecha1 = (moment().format(this.fechaInicial.year.toString() +
      '-' + this.fechaInicial.month.toString() +
      '-' + this.fechaInicial.day.toString()));
    let fecha2 = (moment().format(this.fechaFinal.year.toString() +
      '-' + this.fechaFinal.month.toString() +
      '-' + this.fechaFinal.day.toString()));

    let fecha = 'Reportes tickets ' + moment().format('DDMMYYYYhhmmA')
    this.ticketsService.downloadexcelfile({ fecha1: fecha1, fecha2: fecha2, fecha: fecha, estatus: this.estatusFilter, usuario: this.esistemasFilter }).subscribe(
      res => {
        /* console.log(res) */
        FileSaver.saveAs(res, fecha + ".xlsx")
      },
      err => {
        console.log(err)
      }
    )
  }

  getTicketsOpen() {
    this.ticketsService.getTicketsOpen({ usuario: sessionStorage.getItem('userid'), depto: parseInt(sessionStorage.getItem('depto')) }).subscribe(
      res => {
        this.cantidadTA = res
        this.ticketsService.changeData(this.cantidadTA.toString());
      },
      err => {
        console.error(err)
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
    this.getTicketsOpen()
    let usuario = null
    if (sessionStorage.getItem('depto') != '4' && sessionStorage.getItem('depto') != '5' && sessionStorage.getItem('depto') != '6') {
      usuario = parseInt(sessionStorage.getItem('userid'))
    }
    else {
      usuario = this.esistemasFilter
    }
    this.ticketsService.getTicketsForTable({ estatus: this.estatusFilter, fecha1: fecha1, fecha2: fecha2, usuario: usuario, depto: parseInt(sessionStorage.getItem('depto')) }).subscribe(
      res => {
        this.tickets = res
        if (this.tickets.length > 0) {
          this.noInfo = false
          this.dtTrigger.next()
        }
        else {
          this.noInfo = true
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
    /* console.log(this.editingTicket) */
    if (reporte.estatus_idestatus != 3) {
      if (reporte.comentarios && reporte.fecha_respuesta) {
        this.horaSeguimiento = { hour: parseInt(moment().format('HH')), minute: parseInt(moment().format('mm')) };
        this.fechaSeguimiento = new NgbDate(parseInt(moment(this.editingTicket.fecha).format('YYYY')), parseInt(moment(this.editingTicket.fecha).format('MM')), parseInt(moment(this.editingTicket.fecha).format('DD')));
        $('#agregaSeguimiento').modal('show')
      }
      else {
        this.fechaRespuesta = new NgbDate(parseInt(moment(this.editingTicket.fecha).format('YYYY')), parseInt(moment(this.editingTicket.fecha).format('MM')), parseInt(moment(this.editingTicket.fecha).format('DD')));
        $('#editareportemodal').modal('show')
      }
    }
    else {
      this.showModal(4, 'Ticket atendido', 'No se puede agregar seguimientos a este ticket, ya que está cerrado')
    }
  }

  setSeguimiento(horas, minutos) {

    if (!horas) {
      horas = 0;
    }
    if (!minutos) {
      minutos = 0;
    }

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
      /* console.log(this.seguimiento) */
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
      this.ticketsService.getSeguimientosTicket({ idticket: this.ticketSelected }).subscribe(
        res => {
          this.seguimientosTicket = res
          if (this.seguimientosTicket.length > 0) {
            this.dtTriggerSeg.next()
            $('#verSeguimientosModal').modal('show')
          }
          else {
            this.showModal(2, 'No existen registros', 'Aún no se han registrado seguimientos a este ticket')
          }
        },
        err => console.error(err)
      )
    }
    else {
      this.showModal(2, 'No existen registros', 'Aún no se han registrado seguimientos a este ticket')
    }
  }

  setSolucionTicket() {
    /* console.log(this.solucionTicket) */
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
    else if (tipo == 3) {
      $('#alertModal').addClass('alert alert-success')
      $('#modalText').html('<i class="mr-2 fas fa-check-circle"></i>' + text);
    }
    else if (tipo == 4) {
      $('#alertModal').addClass('alert alert-primary')
      $('#modalText').html('<i class="mr-2 fas fa-exclamation-circle"></i>' + text);
    }
    $('#headerModal').html(header)
    $('#advertenciaModal').modal('show')
  }
  ///////////////////////////////////////////////////FUNCIONES//////////////////////////////////////////////////////
}
