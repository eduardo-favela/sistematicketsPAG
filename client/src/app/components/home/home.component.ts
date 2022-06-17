import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { TicketsService } from 'src/app/services/tickets.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { ServiciosService } from 'src/app/services/servicios.service';
import { EquipoSistemasService } from 'src/app/services/equipo-sistemas.service';
import { EquiposService } from 'src/app/services/equipos.service';

import { ReportesService } from 'src/app/services/reportes.service';
import * as moment from 'moment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  constructor(private ticketsService: TicketsService, private usuariosService: UsuariosService,
    private equipoSistemasService: EquipoSistemasService, private equiposService: EquiposService,
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
  telefono = null
  reporteid = null
  responsereporte: any
  horaTicket = { hour: parseInt(moment().format('HH')), minute: parseInt(moment().format('mm')) };
  fechaTicket: NgbDate = new NgbDate(parseInt(moment().format('YYYY')), parseInt(moment().format('MM')), parseInt(moment().format('DD')));


  servicios: any = [];
  tiposServicios: any = [];
  asignaEquipo: boolean = false;
  resEquipoSistemas: any = [];
  equipoSistemas: any = [];
  equiposUsuario: any = [];
  actividades: any = [];


  uenUsuario: any = null

  loading: boolean = false;

  ticket: any = {
    fecha: null,
    usuario: null,
    servicioparauen: null,
    servicio: null,
    tiposervicio: null,
    asignacion: null,
    actividad: null,
    descripcion: null
  }

  tipoEquipo = null
  equipoticket = null
  noSerieEquipo = null

  sessionStorage = sessionStorage;

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
    let depto = ((parseInt(this.sessionStorage.getItem('depto'))) == 3 ? (1) : (parseInt(this.sessionStorage.getItem('depto'))))
    this.serviciosService.getServiciosDepto({ depto: depto }).subscribe(
      res => {
        this.servicios = res
      },
      err => console.error(err)
    )
  }

  getTiposServicios() {
    this.ticket.tiposervicio = null
    this.ticket.asignacion = null
    this.ticket.actividad = null
    this.equipoticket = null
    this.tipoEquipo = null
    this.noSerieEquipo = null;
    this.equipoSistemas = []
    this.actividades = []
    this.serviciosService.getTServicioForTicket({ servicio: this.ticket.servicio }).subscribe(
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
        this.showModal(2, 'Advertencia', 'Se debe seleccionar un usuario')
      }
    }
    else {
      this.asignaEquipo = false
    }
    if (item.depto == 1 || item.depto == 6) {
      this.equipoSistemas = this.resEquipoSistemas.filter(ing => ing.depto == 1);
      this.equipoSistemas.push(...this.resEquipoSistemas.filter(ing => ing.depto == 3));
      this.equipoSistemas.push(...this.resEquipoSistemas.filter(ing => ing.depto == 6));
    }
    else if (item.depto == 2 || item.depto == 5) {
      this.equipoSistemas = this.resEquipoSistemas.filter(ing => ing.depto == 2);
      this.equipoSistemas.push(...this.resEquipoSistemas.filter(ing => ing.depto == 5));
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
      this.showModal(2, 'Advertencia', 'Se debe seleccionar un usuario')
    }
  }

  selectEquipoChange() {
    let item = this.equiposUsuario.find(equipo => equipo.idequipo == this.equipoticket);
    this.tipoEquipo = item.tipoEquipo
    this.noSerieEquipo = item.no_serie
  }

  getActividades() {
    this.ticket.actividad = null;
    this.actividades = []
    this.serviciosService.getActividadesForTicket({ servicio: parseInt(this.ticket.servicio), tipoServicio: parseInt(this.ticket.tiposervicio) }).subscribe(
      res => {
        this.actividades = res
      },
      err => console.error(err)
    )
  }

  clearInputs() {
    this.inputUsuario.clear()
    this.correo = null
    this.telefono = null
    this.ticket.comentarios = null
    this.ticket.fecha = null
    this.ticket.usuario = null
    this.ticket.servicioparauen = null
    this.ticket.servicio = null
    this.ticket.tiposervicio = null
    this.ticket.asignacion = null
    this.ticket.actividad = null
    this.ticket.descripcion = null
    this.uenUsuario = null
    this.asignaEquipo = false
    this.horaTicket = { hour: parseInt(moment().format('HH')), minute: parseInt(moment().format('mm')) };
    this.fechaTicket = new NgbDate(parseInt(moment().format('YYYY')), parseInt(moment().format('MM')), parseInt(moment().format('DD')));
  }

  registrarTicket() {
    this.loading = true

    if (this.ticket.actividad) {
      let item = this.actividades.find(actividad => actividad.id_actividad == this.ticket.actividad)
      this.ticket.tiempo_resolucion_servicio = item.tiempo
    }

    this.ticket.estatus = 1

    this.ticket.fecha = (moment().format(this.fechaTicket.year.toString() +
      '-' + this.fechaTicket.month.toString() +
      '-' + this.fechaTicket.day.toString()) + ' ' + this.horaTicket.hour.toString() +
      ':' + this.horaTicket.minute.toString() + ':00');

    this.ticket.servicioparauen = ($('#radioButtonUsuario').is(':checked') ? 0 : 1)

    if (this.ticket.fecha && this.ticket.usuario && this.ticket.servicio && this.ticket.tiposervicio && this.ticket.actividad && this.ticket.descripcion) {

      this.ticketsService.setTicket({ ticket: this.ticket, equipoticket: this.equipoticket }).subscribe(
        res => {
          if (res) {
            this.loading = false
            this.responsereporte = res
            this.reporteid = this.responsereporte.insertId
            this.clearInputs()
            this.showModal(3, 'Ticket registrado', `El ticket se registró correctamente con el folio: <strong>${this.reporteid}</strong>`)
          }
        },
        err => console.error(err)
      )
    }
    else {
      this.loading = false
      this.showModal(1, 'Error', 'Se deben llenar todos los campos para registrar el ticket')
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
    else {
      $('#alertModal').addClass('alert alert-success')
      $('#modalText').html('<i class="mr-2 fas fa-check-circle"></i>' + text);
    }
    $('#headerModal').html(header)
    $('#advertenciaModal').modal('show')
  }

/*   enviarCorreo(reporte) {
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
  } */

/*   enviarCorreoInterno(reporte) {
    let emailspruebas = 'e.favela@kiosko.com.mx'
    let sucursal = $('#inputSucursal').find('input:text').val()
    let problema = $('#problema option:selected').text()
    let maquina = $('#tipomaq option:selected').text()
    let ciudad = $('#plaza').val()
    let reportecontents = {
      comments: this.ticket.comentarios, ciudad: ciudad, maq: maquina, problema: problema, correo: this.correo, telefono: this.telefono.toString(), sucursal: sucursal,
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
  } */

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
    this.uenUsuario = item.uen;
    this.ticket.usuario = item.idempleado;
    this.equipoticket = null;
    this.tipoEquipo = null;
    this.noSerieEquipo = null;
    this.correo = item.correo;
    this.telefono = item.telefono;
    this.getEquipoUsuario();
  }

  onChangeSearch(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }

  onCleared(e) {
    this.inputUsuario.close();
    this.uenUsuario = null;
    this.equipoticket = null;
    this.tipoEquipo = null;
    this.noSerieEquipo = null;
    this.telefono = null;
    this.correo = null;
    this.getEquipoUsuario();
  }

  onFocusedUsuario(e) {
    // do something when input is focused
    this.inputUsuario.open()
  }
  ///////////////////////////////////AUTOCOMPLETES///////////////////////////////////
}
