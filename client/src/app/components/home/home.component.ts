import { Component, OnInit, ViewChild } from '@angular/core';
import { CentroscostosService } from 'src/app/services/centroscostos.service';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { TicketsService } from 'src/app/services/tickets.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { ServiciosService } from 'src/app/services/servicios.service';
import { EquipoSistemasService } from 'src/app/services/equipo-sistemas.service';
import { EquiposService } from 'src/app/services/equipos.service';

import { ReportesService } from 'src/app/services/reportes.service';
import * as moment from 'moment';
import * as $ from 'jquery'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  constructor(private ticketsService: TicketsService, private usuariosService: UsuariosService,
    private equipoSistemasService: EquipoSistemasService, private equiposService: EquiposService,
    private centroscostosService: CentroscostosService,
    private serviciosService: ServiciosService,
    private reportesService: ReportesService) { }
  ///////////////////////////////////AUTOCOMPLETES///////////////////////////////////
  keywordUsuarios = 'nombre'
  placeholder = 'Buscar una sucursal...'
  usuarios: any = []
  placeholderUsuario = 'Busca un colaborador...'
  inputsDisabled = false
  @ViewChild('inputUsuario') inputUsuario;
  ///////////////////////////////////AUTOCOMPLETES///////////////////////////////////

  ///////////////////////////////////VARIABLES Y PROPIEDADES GLOBALES DE LA CLASE///////////////////////////////////

  correo = null
  comentarios = null
  telefono = null
  reporteid = null
  responsereporte: any

  horaTicket = { hour: parseInt(moment().format('HH')), minute: parseInt(moment().format('mm')) };
  horaRespuesta = { hour: parseInt(moment().format('HH')), minute: parseInt(moment().format('mm')) };
  fechaTicket: NgbDate = new NgbDate(parseInt(moment().format('YYYY')), parseInt(moment().format('MM')), parseInt(moment().format('DD')));
  fechaRespuesta: NgbDate = new NgbDate(parseInt(moment().format('YYYY')), parseInt(moment().format('MM')), parseInt(moment().format('DD')));

  servicios: any = [];
  tiposServicios: any = [];
  asignaEquipo: boolean = false;
  resEquipoSistemas: any = [];
  equipoSistemas: any = [];
  equiposUsuario: any = [];


  uenUsuario: any = null

  ticket: any = {
    fecha: null,
    usuario: null,
    servicioparauen: null,
    servicio: null,
    tiposervicio: null,
    asignacion: null,
    fecharespuesta: null
  }

  tipoEquipo = null
  equipoticket = null

  ///////////////////////////////////VARIABLES Y PROPIEDADES GLOBALES DE LA CLASE///////////////////////////////////

  ngOnInit(): void {
    this.getUsuarios()
    this.getServicios()
    this.getEquipoSistemas()
  }

  getUsuarios() {
    this.usuariosService.getUsuarios().subscribe(
      res => {
        this.usuarios = res
      },
      err => console.error(err)
    )
  }

  getServicios() {
    this.serviciosService.getServicios().subscribe(
      res => {
        this.servicios = res
      },
      err => console.error(err)
    )
  }

  getTiposServicios() {
    this.ticket.tiposervicio = null
    this.ticket.asignacion = null
    this.equipoticket = null
    this.tipoEquipo = null
    this.equipoSistemas = []
    this.serviciosService.getTiposServicio({ servicio: this.ticket.servicio }).subscribe(
      res => {
        this.tiposServicios = res
      },
      err => console.error(err)
    )
    let item = this.servicios.find(servicio => servicio.idservicios == this.ticket.servicio);

    if (item.asignar_equipo == 1) {
      if (this.ticket.usuario) {
        this.asignaEquipo = true;
        this.getEquipoUsuario()
      }
      else {
        $("#advertenciaModal").modal('show')
      }
    }
    else {
      this.asignaEquipo = false
    }
    if (item.depto == 1) {
      this.equipoSistemas = this.resEquipoSistemas.filter(ing => ing.depto == 1);
      this.equipoSistemas.push(...this.resEquipoSistemas.filter(ing => ing.depto == 3));
    }
    else if (item.depto == 2) {
      this.equipoSistemas = this.resEquipoSistemas.filter(ing => ing.depto == 2);
    }
  }

  getEquipoSistemas() {
    this.equipoSistemasService.getEquipoSistemas().subscribe(
      res => {
        this.resEquipoSistemas = res
      },
      err => console.error(err)
    )
  }

  getEquipoUsuario() {
    if (this.ticket.usuario) {
      this.equiposService.getEquipos({ idusuario: this.ticket.usuario }).subscribe(
        res => {
          this.equiposUsuario = res
        },
        err => console.error(err)
      )
    }
    else {
      $("#advertenciaModal").modal('show')
    }
  }

  selectEquipoChange() {
    let item = this.equiposUsuario.find(equipo => equipo.idequipo == this.equipoticket);
    this.tipoEquipo = item.tipoEquipo
  }

  clearInputs() {
    this.inputUsuario.clear()
    this.correo = null
    this.telefono = null
    this.comentarios = null
    $('#telefono').removeClass('is-valid')
    $('#telefono').removeClass('is-invalid')
  }

  registrarTicket() {
    this.ticket.fecha = (moment().format(this.fechaTicket.year.toString() +
      '-' + this.fechaTicket.month.toString() +
      '-' + this.fechaTicket.day.toString()) + ' ' + this.horaTicket.hour.toString() +
      ':' + this.horaTicket.minute.toString() + ':00');

    this.ticket.fecharespuesta = (moment().format(this.fechaRespuesta.year.toString() +
      '-' + this.fechaRespuesta.month.toString() +
      '-' + this.fechaRespuesta.day.toString()) + ' ' + this.horaRespuesta.hour.toString() +
      ':' + this.horaRespuesta.minute.toString() + ':00');

    this.ticket.servicioparauen = (this.ticket.servicioparauen=$('#radioButtonUsuario').is(':checked') ? 0 : 1)

    console.log(this.ticket)
    /*     if (this.nomEmp && this.idpventa && this.problema && this.correo && this.telefono && this.comentarios) {
          if (this.telefono.toString().length == 10) {
            this.reportesService.registraReporte({ estatus: 1, tipomaq: this.tipomaq, problema_reportado: this.problema, puntoventa: this.idpventa, nombre_report: this.nomEmp, comentarios: this.comentarios, correo_contacto: this.correo, telcontacto: this.telefono.toString() }).subscribe(
              res => {
                this.responsereporte = res
                this.reporteid = this.responsereporte.insertId
                this.enviarCorreo({ email: this.correo, folioreporte: this.reporteid })
                this.enviarCorreoInterno({ email: this.correo, folioreporte: this.reporteid })
                this.dia = moment().format('DD-MM-YYYY')
                this.hora = moment().format('hh:mm A')
                this.clearInputs()
                $('#nuevoReporteModal').modal('show')
              },
              err => {
                alert('Ocurrió un error al registrar el reporte')
              }
            )
          }
          else {
            alert("El número de teléfono no es válido")
          }
        }
        else {
          console.log(this.nomEmp, this.idpventa, this.problema, this.correo, this.telefono, this.comentarios)
          alert('Se deben llenar todos los campos para registrar un reporte')
        } */
  }

  enviarCorreo(reporte) {
    this.reportesService.enviarEmail({ fecha: moment().format('DD-MM-YYYY'), folio: reporte.folioreporte, hora: moment().format('hh:mm A'), email: reporte.email }).subscribe(
      res => {
        if (res.hasOwnProperty('Ok')) {
          console.log('se envió el correo con éxito')
        }
      },
      err => {
        alert('ocurrió un error')
      }
    )
  }

  enviarCorreoInterno(reporte) {
    let emailspruebas = 'e.favela@kiosko.com.mx'
    let sucursal = $('#inputSucursal').find('input:text').val()
    let problema = $('#problema option:selected').text()
    let maquina = $('#tipomaq option:selected').text()
    let ciudad = $('#plaza').val()
    let reportecontents = {
      comments: this.comentarios, ciudad: ciudad, maq: maquina, problema: problema, correo: this.correo, telefono: this.telefono.toString(), sucursal: sucursal,
      fecha: moment().format('DD-MM-YYYY'), folio: reporte.folioreporte, hora: moment().format('hh:mm A'), email: emailspruebas
    }
    console.log(reportecontents)
    this.reportesService.enviarEmailinterno(reportecontents).subscribe(
      res => {
        if (res.hasOwnProperty('Ok')) {
          console.log('se envió el correo con éxito')
        }
      },
      err => {
        alert('ocurrió un error')
      }
    )
  }

  onKeyUpNoTel() {
    if (this.telefono) {
      let telefono = this.telefono.toString()
      if (telefono.length < 10 || telefono.length > 10) {
        $('#telefono').removeClass('is-valid')
        $('#telefono').addClass('is-invalid')
      }
      else if (telefono.length == 10) {
        $('#telefono').removeClass('is-invalid')
        $('#telefono').addClass('is-valid')
      }
    }
    else {
      $('#telefono').removeClass('is-valid')
      $('#telefono').removeClass('is-invalid')
    }
  }

  ///////////////////////////////////AUTOCOMPLETES///////////////////////////////////
  selectEventUsuario(item) {
    this.uenUsuario = item.uen
    this.ticket.usuario = item.idempleado
    this.equipoticket = null
    this.tipoEquipo = null
    this.getEquipoUsuario()
  }

  onChangeSearch(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }

  onCleared(e) {
    this.inputUsuario.close()
    this.uenUsuario = null
    this.equipoticket = null
    this.tipoEquipo = null
    this.getEquipoUsuario()
  }

  onFocusedUsuario(e) {
    // do something when input is focused
    this.inputUsuario.open()
  }
  ///////////////////////////////////AUTOCOMPLETES///////////////////////////////////
}
