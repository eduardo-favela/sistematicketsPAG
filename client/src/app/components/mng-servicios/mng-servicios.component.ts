import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { ServiciosService } from 'src/app/services/servicios.service';

////////////////////////////////////////////TABLAS////////////////////////////////////////////


//////////////////////////////////////////////////////////////////////////////////////////////



@Component({
  selector: 'app-mng-servicios',
  templateUrl: './mng-servicios.component.html',
  styleUrls: ['./mng-servicios.component.css']
})
export class MngServiciosComponent implements OnInit {

  constructor(private serviciosService: ServiciosService) { }

  ////////////////////////////////////////////TABLAS////////////////////////////////////////////
  dtOptions: DataTables.Settings = {};

  dtTrigger: Subject<any> = new Subject<any>();
  dtTriggerTS: Subject<any> = new Subject<any>();
  dtTriggerS: Subject<any> = new Subject<any>();
  //////////////////////////////////////////////////////////////////////////////////////////////

  noInfo = true;

  tipoServicios: any = [];

  servicioHasTipo: any = [];

  deptosistemas: any = [];

  servicios: any = [];

  serviciosTable: any = [];

  tiposServicioTable: any = [];

  tipoServiciosAsignados: any = [];

  tipoServiciosPDesasignar: any = [];

  servicio = null;

  servicioNew: any = {
    servicio: null,
    asignar_equipo: null,
    depto: null
  }

  tipoServicioNew: any = {
    tipoServicio: null
  }

  servicioeditando: any = {}
  tservicioeditando: any = {}

  /////////////////////////////////VARIABLES Y PROPIEDADES DEL APARTADO DE ACTIVIDADES/////////////////////////////////
  actividades: any = [];
  actividadNew: any = {};
  actividadEditando: any = {};
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  ngOnInit(): void {
    this.getdeptosSistemas()
    this.getServicios()
    this.getServiciosTable()
    this.getTiposServicioTable()
    this.getActividades()

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      lengthMenu: [5, 10, 25],
      processing: true,
      language: {
        url: 'https://cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json'
      }
    }
  }

  onServicioChange() {
    this.getTiposServicio()
  }

  getServicios() {
    this.serviciosService.getServicios().subscribe(
      res => {
        this.servicios = res
      },
      err => console.error(err)
    )
  }

  getServiciosTable() {
    this.serviciosService.getServiciosTable().subscribe(
      res => {
        this.serviciosTable = res
        this.dtTriggerS.next();
      },
      err => console.error(err)
    )
  }

  getTiposServicio() {
    this.servicioHasTipo = []
    this.getTiposServicioAsignados()
    if (this.servicio) {
      this.serviciosService.getTiposServicio({ idservicio: this.servicio }).subscribe(
        res => {
          this.tipoServicios = res
          if (this.tipoServicios.length > 0) {
            this.noInfo = false
          }
          else {
            this.noInfo = true
          }
        },
        err => console.error(err)
      )
    }
  }

  getTiposServicioTable() {
    this.tiposServicioTable = []
    this.getTiposServicioAsignados()
    this.serviciosService.getTiposServicioTable().subscribe(
      res => {
        this.tiposServicioTable = res
        this.dtTriggerTS.next();
      },
      err => console.error(err)
    )
  }

  getTiposServicioAsignados() {
    if (this.servicio) {
      this.serviciosService.getTiposServicioAsignados({ idservicio: this.servicio }).subscribe(
        res => {
          this.servicioHasTipo = res;
          this.tipoServiciosAsignados = [];
          this.tipoServiciosAsignados.push(...this.servicioHasTipo);
          this.tipoServiciosPDesasignar = [];
          if (this.servicioHasTipo.length > 0) {
            this.noInfo = false
          }
          else {
            this.noInfo = true
          }
        },
        err => console.error(err)
      )
    }
  }

  getdeptosSistemas() {
    this.serviciosService.getDeptosSistemas().subscribe(
      res => {
        this.deptosistemas = res
      },
      err => console.error(err)
    )
  }

  setServicio() {
    this.servicioNew.asignar_equipo = ($('#radioButtonNoAplica').is(':checked') ? 0 : 1)
    if (this.servicioNew.servicio && this.servicioNew.asignar_equipo != null && this.servicioNew.depto) {
      this.servicioNew.servicio = this.servicioNew.servicio.toString().toUpperCase().trim()
      this.serviciosService.setServicio(this.servicioNew).subscribe(
        res => {
          if (res) {
            this.servicioNew.servicio = null
            this.servicioNew.asignar_equipo = null
            this.servicioNew.depto = null
            this.destroyTableServicios()
            this.getTiposServicio()
            this.getServicios()
            this.getServiciosTable()
            this.showModal(2, 'Registro guardado', 'El servicio se guardó exitosamente')
          }
          else {
            this.showModal(1, 'Advertencia', 'El servicio ya existe')
          }
        },
        err => console.error(err)
      )
    }
    else {
      this.showModal(1, 'Advertencia', 'Debe llenar todos los campos para registrar un servicio')
    }
  }

  setTipoServicio() {
    if (this.tipoServicioNew.tipoServicio) {
      this.tipoServicioNew.tipoServicio = this.tipoServicioNew.tipoServicio.toString().toUpperCase().trim()
      this.serviciosService.setTipoServicio(this.tipoServicioNew).subscribe(
        res => {
          if (res) {
            this.tipoServicioNew.tipoServicio = null
            this.destroyTableTServicio()
            this.getTiposServicio()
            this.getTiposServicioTable()
            this.showModal(2, 'Registro guardado', 'El tipo de servicio se guardó exitosamente')
          }
          else {
            this.showModal(1, 'Advertencia', 'El tipo de servicio ya existe')
          }
        },
        err => console.error(err)
      )
    }
    else {
      this.showModal(1, 'Advertencia', 'Debe ingresar un nombre para el tipo de usuario')
    }
  }

  //SET SERVICIO HAS TIPO DE SERVICIO
  setServicioHTS() {
    if (this.servicioHasTipo.length > 0) {
      this.serviciosService.setServicioHTS(this.servicioHasTipo).subscribe(
        res => {
          if (res) {
            if (this.tipoServiciosPDesasignar.length > 0) {
              this.unsetServicioHTS();
            }
            else {
              this.servicio = null;
              this.servicioHasTipo = []
              this.tipoServicios = []
              this.noInfo = true
              this.showModal(2, 'Registros guardados', 'Los cambios se guardaron correctamente')
            }
          }
        },
        err => console.error(err)
      )
    }
    else {
      this.unsetServicioHTS();
    }
  }

  unsetServicioHTS() {
    if (this.tipoServiciosPDesasignar.length > 0) {
      this.serviciosService.unsetTipoServicio(this.tipoServiciosPDesasignar).subscribe(
        res => {
          if (res) {
            this.servicio = null;
            this.servicioHasTipo = []
            this.tipoServicios = []
            this.noInfo = true
            this.showModal(2, 'Registros guardados', 'Los cambios se guardaron correctamente')
          }
        },
        err => {
          console.error(err)
        }
      )
    }
    else {
      this.showModal(1, 'Advertencia', 'No hay registros por guardar')
    }
  }

  showModal(tipoModal, header, descripcion) {
    if (tipoModal == 1) {
      $('#headerModalError').html(header)
      $('#descripcionPSuccess').html(`<i class="mr-2 fa fa-exclamation-triangle" aria-hidden="true"></i>${descripcion}`)
      $('#advertenciaModal').modal('show')
    }
    else if (tipoModal == 2) {
      $('#headerModal').html(header)
      $('#descripctionP').html(`<i class="fas fa-check-circle mr-2"></i>${descripcion}`)
      $('#successModal').modal('show')
    }
  }

  ///////////////////////////////////////FUNCIONES DEL APARTADO DE ACTIVIDADES////////////////////////////////
  setActividad() {
    if (this.actividadNew.actividad) {
      this.actividadNew.actividad = this.actividadNew.actividad.toString().toUpperCase().trim()
      this.serviciosService.setActividad(this.actividadNew).subscribe(
        res => {
          if (res) {
            this.destroyTableActividades()
            this.getActividades()
            this.actividadNew = {}
            this.showModal(2, 'Registro realizado', 'La actividad se guardó correctamente')
          }
          else {
            this.showModal(1, 'Advertencia', 'La actividad ya existe')
          }
        },
        err => console.error(err)
      )
    }
    else {
      this.showModal(1, 'Advertencia', 'No hay actividad por guardar')
    }
  }
  onEditActividadButtonClick(item) {
    this.actividadEditando = { ...item }
    $('#editactividadmodal').modal('show')
  }

  getActividades() {
    this.serviciosService.getActividades().subscribe(
      res => {
        this.actividades = res
        // Calling the DT trigger to manually render the table
        this.dtTrigger.next();
      },
      err => console.error(err)
    )
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
    this.dtTriggerTS.unsubscribe();
  }

  guardarCambiosModalEditA() {
    if (this.actividadEditando.actividad) {
      this.actividadEditando.actividad = this.actividadEditando.actividad.toString().toUpperCase().trim()
      this.serviciosService.updateActividad(this.actividadEditando).subscribe(
        res => {
          if (res) {
            this.actividadEditando = {}
            this.destroyTableActividades()
            this.getActividades()
            $('#editactividadmodal').modal('hide')
            this.showModal(2, 'Registro guardado', 'El registro se guardó con éxito')
          }
        },
        err => console.error(err)
      )
    }
    else {
      this.showModal(1, 'Advertencia', 'No hay cambios por guardar')
    }
  }

  cancelarCambiosModalEditA() {
    this.actividadEditando = {}
  }

  destroyTableActividades() {
    let table = $('#tablaActividades').DataTable()
    table.destroy();
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////

  //////////////////////////////////////MODAL EDITAR SERVICIO FUNCTIONS//////////////////////////////////////

  onEditServicioButtonClick(servicio) {
    this.servicioeditando.idservicios = servicio.idservicios;
    this.servicioeditando.depto = servicio.depto;
    this.servicioeditando.estatusid = servicio.estatusid;
    this.servicioeditando.asignar_equipoid = servicio.asignar_equipoid;
    this.servicioeditando.servicio = servicio.servicio;
    $("#editaserviciomodal").modal('show')
  }

  guardarCambiosModalEdit() {
    if (this.servicioeditando.servicio && this.servicioeditando.idservicios && this.servicioeditando.depto && this.servicioeditando.estatusid && this.servicioeditando.asignar_equipoid) {
      this.servicioeditando.servicio = this.servicioeditando.servicio.toString().toUpperCase().trim()
      this.serviciosService.updateServicio(this.servicioeditando).subscribe(
        res => {
          if (res) {
            this.servicioeditando = {}
            this.destroyTableServicios()
            this.getServiciosTable()
            this.getServicios()
            $("#editaserviciomodal").modal('hide')
            this.showModal(2, 'Registro guardado', 'Los cambios se guardaron correctamente')
          }
        },
        err => console.error(err)
      )
    }
    else {
      alert('Se deben llenar todos los campos')
    }
  }

  destroyTableServicios() {
    let table = $('#tablaServicios').DataTable()
    table.destroy();
  }

  cancelarCambiosModalEdit() {
    this.servicioeditando = {}
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////

  //////////////////////////////////////MODAL EDITAR TIPO DE SERVICIO FUNCTIONS//////////////////////////////////////

  onEditTServicioButtonClick(servicio) {
    this.tservicioeditando.idtipos_servicio = servicio.idtipos_servicio;
    this.tservicioeditando.tiposervicio = servicio.tiposervicio;
    this.tservicioeditando.estatus = servicio.estatusid;
    $("#editatserviciomodal").modal('show')
  }

  guardarCambiosModalEditTS() {
    if (this.tservicioeditando.tiposervicio) {
      this.tservicioeditando.tiposervicio = this.tservicioeditando.tiposervicio.toString().toUpperCase().trim()
      this.serviciosService.updateTipoServicio(this.tservicioeditando).subscribe(
        res => {
          if (res) {
            this.tservicioeditando = {}
            this.destroyTableTServicio()
            this.getTiposServicioTable()
            $("#editatserviciomodal").modal('hide')
            this.showModal(2, 'Registros guardados', 'Los cambios se guardaron correctamente')
          }
        },
        err => console.error(err)
      )
    }
    else {
      alert('Se deben llenar todos los campos')
    }
  }

  cancelarCambiosModalEditTS() {
    this.tservicioeditando = {}
  }

  destroyTableTServicio() {
    let table = $('#tablaTServicios').DataTable()
    table.destroy();
  }
  //////////////////////////////////////////////////////////////////////////////////////////////////////////

  //AGREGAR ELEMENTO A LA RELACIÓN ENTRE EL SERVICIO Y EL TIPO DE SERVICIO
  addElement(item: any) {
    if (this.servicio) {
      let index = this.tipoServicios.findIndex(servicio => servicio.idtipos_servicio == item.idtipos_servicio)
      let elementSpliced = this.tipoServicios.splice(index, 1)[0];
      elementSpliced.idServicio = this.servicio
      this.servicioHasTipo.push(elementSpliced)
    }
    else {
      this.showModal(1, 'Advertencia', 'Se debe seleccionar un servicio')
    }
  }

  //ELIMINAR ELEMENTO DE LA RELACIÓN ENTRE EL SERVICIO Y EL TIPO DE SERVICIO
  async deleteElement(item: any) {
    let itemAsignado = this.tipoServiciosAsignados.find(tiposervicio => tiposervicio.idtipos_servicio == item.idtipos_servicio)
    if (itemAsignado) { this.tipoServiciosPDesasignar.push(item) }
    let index = this.servicioHasTipo.findIndex(servicio => servicio.idtipos_servicio == item.idtipos_servicio)
    let elementSpliced = this.servicioHasTipo.splice(index, 1)[0];
    //ELIMINAR LA PROPIEDAD DEL OBJETO PARA REGRESARLO AL ARREGLO
    /* delete elementSpliced.idServicio */
    this.tipoServicios.push(elementSpliced)
  }
}
