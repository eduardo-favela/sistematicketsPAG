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

  constructor(private ticketsService: TicketsService) { }

  ngOnInit(): void {

    this.getTicketsForTable()

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
  }

  ///////////////////////////////////VARIABLES Y PROPIEDADES GLOBALES DE LA CLASE///////////////////////////////////
  sucursales = null
  estatus = null
  estatusnuevo = null
  commentsnew = null
  folioreporte = null
  responsereportes: any = []
  noInfo = true
  fechaparam = new Date(moment().format('YYYY-MM-DD'))
  fechaInicial: NgbDate = new NgbDate(parseInt(moment().format('YYYY')), parseInt(moment().format('MM')), parseInt(moment().format('DD')));
  fechaFinal: NgbDate = new NgbDate(parseInt(moment().format('YYYY')), parseInt(moment().format('MM')), parseInt(moment().format('DD')));
  sucursal = null
  estatusrep = null
  idReporte = null
  detallesreporte: any = []
  sessionStorage = sessionStorage

  ////////////////////////////////////////////////VARIABLES DE TABLA////////////////////////////////////////////////

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  tickets: any = [];

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  ///////////////////////////////////////////////////FUNCIONES//////////////////////////////////////////////////////

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
    $('#inputcomments').removeClass("is-valid")
    $('#inputcomments').removeClass("is-invalid")
    $('#selectstatus').removeClass("is-valid")
    $('#selectstatus').removeClass("is-invalid")
    this.estatusnuevo = null
    this.commentsnew = null
    this.idReporte = null
  }

  getTicketsForTable() {
    this.ticketsService.getTicketsForTable().subscribe(
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

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  clearInputs() {
    this.folioreporte = null
    this.fechaInicial = new NgbDate(parseInt(moment().format('YYYY')), parseInt(moment().format('MM')), parseInt(moment().format('DD')));
    this.fechaFinal = new NgbDate(parseInt(moment().format('YYYY')), parseInt(moment().format('MM')), parseInt(moment().format('DD')));
    this.sucursal = null
    this.estatusrep = null
    this.noInfo = true
  }
  ///////////////////////////////////////////////////FUNCIONES//////////////////////////////////////////////////////
}
