import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { UsuariosService } from 'src/app/services/usuarios.service'
import { EquiposService } from 'src/app/services/equipos.service'

@Component({
  selector: 'app-empleados-equipos',
  templateUrl: './empleados-equipos.component.html',
  styleUrls: ['./empleados-equipos.component.css']
})
export class EmpleadosEquiposComponent implements OnInit {

  loading: boolean = false;
  loadingEC: boolean = false;
  loadingE: boolean = false;
  loadingEE: boolean = false;
  loadingChasE: boolean = false;
  loadingAE: boolean = false;
  loadingDAE: boolean = false;

  colabEditing: any = {}
  equipoEditing: any = {}

  uens: any = [];
  puestos: any = [];
  departamentos: any = [];
  colaboradores: any = [];
  marcas: any = [];
  tipos: any = [];
  equiposTable: any = [];

  colabEditingUEN = null;
  colabEditingPuesto = null;
  colabEditingDepto = null;

  eqEditingTipo = null;
  eqEditingMarca = null;

  colaborador: any = {
    nombres: null,
    apellido_paterno: null,
    apellido_materno: null,
    correo: null,
    telefono: null,
    uen: null,
    puesto: null,
    departamento: null
  }

  equipo: any = {
    equipo: null,
    propiedad: null,
    no_serie: null,
    descripcion: null,
    tipo: null,
    marca: null
  }

  colabAEliminar = null
  eliminaColaborador: any = 2

  equipoAEliminar = null
  eliminaEquipo: any = 2

  equiposResponse: any = {}

  dtOptions: DataTables.Settings = {};

  dtTrigger: Subject<any> = new Subject<any>();
  dtTriggerE: Subject<any> = new Subject<any>();
  dtTriggerChasEA: Subject<any> = new Subject<any>();
  dtTriggerChasENA: Subject<any> = new Subject<any>();

  colabAsignando: any = null;

  equiposNoAsignados: any = [];
  equiposAsignados: any = [];

  equipoAsignando: any = {};
  equipoDesasignando: any = {};

  constructor(private usuariosService: UsuariosService, private equiposService: EquiposService) { }

  ngOnInit(): void {
    this.getUens()
    this.getPuestos()
    this.getDeptos()
    this.getColaboradores()
    this.getMarcas()
    this.getTipos()
    this.getEquiposTable()
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

  ngAfterViewInit() {
    this.dtTriggerChasEA.next()
    this.dtTriggerChasENA.next()
  }

  registrarColab() {
    this.loading = true
    if (this.checkForm('')) {
      this.usuariosService.setColaborador(this.colaborador).subscribe(
        res => {
          if (res) {
            this.loading = false
            this.clearForm()
            this.showModal(3, 'Registro exitoso', 'Colaborador registrado correctamente')
          }
        },
        err => console.error(err)
      )
    }
    else {
      this.showModal(1, 'Advertencia', 'Se deben llenar todos los campos')
      this.loading = false
    }
  }

  registrarEquipo() {
    this.loadingE = true
    if (this.checkFormE('')) {
      this.equiposService.setEquipo(this.equipo).subscribe(
        res => {
          if (res) {
            this.clearFormE()
            this.destroyTableEquipos()
            this.getEquiposTable()
            this.loadingE = false
            this.showModal(3, 'Registro exitoso', 'El equipo se guardó correctamente')
          }
        },
        err => console.error(err)
      )
    }
    else {
      this.loadingE = false
    }
  }

  getEquiposTable() {
    this.equiposService.getEquiposTable().subscribe(
      res => {
        if (res) {
          this.equiposTable = res
          this.dtTriggerE.next()
        }
      },
      err => console.error(err)
    )
  }

  getColaboradores() {
    this.usuariosService.getUsuarios().subscribe(
      res => {
        this.colaboradores = res
        this.dtTrigger.next()
      },
      err => console.error(err)
    )
  }

  getMarcas() {
    this.equiposService.getMarcasEquipos().subscribe(
      res => {
        this.marcas = res;
      },
      err => console.error(err)
    )
  }

  getTipos() {
    this.equiposService.getTiposEquipos().subscribe(
      res => {
        this.tipos = res;
      },
      err => console.error(err)
    )
  }

  editColab(colaborador) {
    this.colabEditing = { ...colaborador }
    this.colabEditingPuesto = this.colabEditing.puesto
    this.colabEditingDepto = this.colabEditing.departamento
    this.colabEditingUEN = this.colabEditing.uen
    $('#editColabModal').modal('show')
  }

  editEquipo(equipo) {
    this.equipoEditing = { ...equipo }
    this.eqEditingTipo = this.equipoEditing.tipo
    this.eqEditingMarca = this.equipoEditing.marca
    $('#editEqModal').modal('show')
  }

  eliminaEq(idequipo) {
    this.equipoAEliminar = idequipo
    $('#eliminaEqModal').modal('show')
  }

  eliminarEquipo() {
    if (this.eliminaEquipo == 1) {
      this.equiposService.deleteEquipo({ id: this.equipoAEliminar }).subscribe(
        res => {
          if (res) {
            this.destroyTableEquipos()
            this.getEquiposTable()
            $('#eliminaEqModal').modal('hide')
            this.showModal(3, 'Equipo deshabilitado', 'El equipo se deshabilitó correctamente')
          }
        },
        err => console.error(err)
      )
    }
    else {
      $('#eliminaEqModal').modal('hide')
    }
  }

  guardarCambiosEE() {
    this.loadingEE = true
    let tipoEq = this.tipos.find(tipos => tipos.tipo_equipo === this.eqEditingTipo)
    this.equipoEditing.tipo = ((tipoEq) ? (tipoEq.idtipo) : (null))
    let marcaEq = this.marcas.find(marcas => marcas.marca === this.eqEditingMarca)
    this.equipoEditing.marca = ((marcaEq) ? (marcaEq.id_marca) : (null))
    if (this.checkFormEE('')) {
      this.equiposService.updateEquipo(this.equipoEditing).subscribe(
        res => {
          if (res) {
            this.clearFormEE()
            this.destroyTableEquipos()
            this.getEquiposTable()
            $('#editEqModal').modal('hide')
            this.loadingEE = false
            this.showModal(3, 'Registro exitoso', 'Los cambios del equipo se guardaron correctamente')
          }
        },
        err => console.error(err)
      )
    }
    else {
      this.loadingEE = false
    }
  }

  guardarCambiosEC() {
    this.loadingEC = true
    let uen = this.uens.find(uens => uens.uen === this.colabEditingUEN)
    this.colabEditing.uen = ((uen) ? (uen.id) : (null))
    let depto = this.departamentos.find(departamentos => departamentos.depto === this.colabEditingDepto)
    this.colabEditing.departamento = ((depto) ? (depto.id) : (null))
    let puesto = this.puestos.find(puestos => puestos.puesto === this.colabEditingPuesto)
    this.colabEditing.puesto = ((puesto) ? (puesto.id) : (null))
    if (this.checkFormEC('')) {
      this.usuariosService.updateColaborador(this.colabEditing).subscribe(
        res => {
          this.clearFormEC()
          $('#editColabModal').modal('hide')
          this.destroyTableColabs()
          this.getColaboradores()
          this.loadingEC = false
          this.showModal(3, 'Registro exitoso', 'Los cambios al colaborador se guardaron correctamente')
        },
        err => console.error(err)
      )
    }
    else {
      this.loadingEC = false
    }
  }

  destroyTableColabs() {
    let table = $('#tablaColabs').DataTable()
    table.destroy();
  }

  destroyTableEquipos() {
    let table = $('#tablaEquipos').DataTable()
    table.destroy();
  }

  uenChangedEC(uenSelected) {
    let uen = this.uens.find(uens => uens.uen === uenSelected)
    this.colabEditing.uen = ((uen) ? (uen.id) : (null))
    this.checkFormEC('uen')
  }

  puestoChangedEC(puestoSelected) {
    let puesto = this.puestos.find(puestos => puestos.puesto === puestoSelected)
    this.colabEditing.puesto = ((puesto) ? (puesto.id) : (null))
    this.checkFormEC('puesto')
  }

  deptoChangedEC(deptoSelected) {
    let depto = this.departamentos.find(departamentos => departamentos.depto === deptoSelected)
    this.colabEditing.departamento = ((depto) ? (depto.id) : (null))
    this.checkFormEC('departamento')
  }

  tipoEqChanged(tipoEquipo) {
    let tipoEq = this.tipos.find(tipos => tipos.tipo_equipo === tipoEquipo)
    this.equipo.tipo = ((tipoEq) ? (tipoEq.idtipo) : (null))
    this.checkFormE('tipo')
  }

  marcaEqChanged(marcaEquipo) {
    let marcaEq = this.marcas.find(marcas => marcas.marca === marcaEquipo)
    this.equipo.marca = ((marcaEq) ? (marcaEq.id_marca) : (null))
    this.checkFormE('marca')
  }

  tipoEqChangedEE(tipoEquipo) {
    let tipoEq = this.tipos.find(tipos => tipos.tipo_equipo === tipoEquipo)
    this.equipoEditing.tipo = ((tipoEq) ? (tipoEq.idtipo) : (null))
    this.checkFormEE('tipo')
  }

  marcaEqChangedEE(marcaEquipo) {
    let marcaEq = this.marcas.find(marcas => marcas.marca === marcaEquipo)
    this.equipoEditing.marca = ((marcaEq) ? (marcaEq.id_marca) : (null))
    this.checkFormEE('marca')
  }

  clearForm() {
    $('#nombresInput').removeClass('is-valid')
    $('#apellidoPat').removeClass('is-valid')
    $('#apellidoMat').removeClass('is-valid')
    $('#uens').removeClass('is-valid')
    $('#uens').val('')
    $('#departamentos').removeClass('is-valid')
    $('#departamentos').val('')
    $('#puestos').removeClass('is-valid')
    $('#puestos').val('')
    this.colaborador.nombres = null;
    this.colaborador.apellido_paterno = null;
    this.colaborador.apellido_materno = null;
    this.colaborador.correo = null;
    this.colaborador.telefono = null;
    this.colaborador.uen = null;
    this.colaborador.puesto = null;
    this.colaborador.departamento = null;
  }

  clearFormEC() {
    $('#nombresInputEC').removeClass('is-invalid')
    $('#nombresInputEC').removeClass('is-valid')

    $('#apellidoPatEC').removeClass('is-invalid')
    $('#apellidoPatEC').removeClass('is-valid')

    $('#apellidoMatEC').removeClass('is-invalid')
    $('#apellidoMatEC').removeClass('is-valid')

    $('#uensEC').removeClass('is-invalid')
    $('#uensEC').removeClass('is-valid')

    $('#departamentosEC').removeClass('is-invalid')
    $('#departamentosEC').removeClass('is-valid')

    $('#puestosEC').removeClass('is-invalid')
    $('#puestosEC').removeClass('is-valid')

    this.colabEditingUEN = null;
    this.colabEditingPuesto = null;
    this.colabEditingDepto = null;

    this.colabEditing = {}
  }

  clearFormE() {
    $('#modeloInput').removeClass('is-valid')
    $('#propiedadInput').removeClass('is-valid')
    $('#tipoEquipoInput').removeClass('is-valid')
    $('#tipoEquipoInput').val('')
    $('#marcaEquipoInput').removeClass('is-valid')
    $('#marcaEquipoInput').val('')
    $('#descripcionTA').removeClass('is-valid')
    $('#descripcionTA').val('')

    this.equipo = {
      equipo: null,
      propiedad: null,
      no_serie: null,
      descripcion: null,
      estatus: null,
      tipo: null,
      marca: null
    }
  }

  clearFormEE() {
    $('#modeloInputEE').removeClass('is-valid')
    $('#modeloInputEE').removeClass('is-invalid')
    $('#propiedadInputEE').removeClass('is-valid')
    $('#propiedadInputEE').removeClass('is-invalid')
    $('#tipoEquipoInputEE').removeClass('is-valid')
    $('#tipoEquipoInputEE').removeClass('is-invalid')
    $('#marcaEquipoInputEE').removeClass('is-valid')
    $('#marcaEquipoInputEE').removeClass('is-invalid')
    $('#descripcionTAEE').removeClass('is-valid')
    $('#descripcionTAEE').removeClass('is-invalid')

    this.equipoEditing = {}
    this.eqEditingMarca = null;
    this.eqEditingTipo = null;
  }

  checkForm(element) {
    let valid = true

    switch (element) {
      case 'nombres':
        if (this.colaborador.nombres) {
          $('#nombresInput').removeClass('is-invalid')
          $('#nombresInput').addClass('is-valid')
        }
        else {
          valid = false;
          $('#nombresInput').removeClass('is-valid')
          $('#nombresInput').addClass('is-invalid')
        }
        break;
      case 'apellido_p':
        if (this.colaborador.apellido_paterno) {
          $('#apellidoPat').removeClass('is-invalid')
          $('#apellidoPat').addClass('is-valid')
        }
        else {
          valid = false;
          $('#apellidoPat').removeClass('is-valid')
          $('#apellidoPat').addClass('is-invalid')
        }
        break;
      case 'apellido_m':
        if (this.colaborador.apellido_materno) {
          $('#apellidoMat').removeClass('is-invalid')
          $('#apellidoMat').addClass('is-valid')
        }
        else {
          valid = false;
          $('#apellidoMat').removeClass('is-valid')
          $('#apellidoMat').addClass('is-invalid')
        }
        break;
      case 'uen':
        if (this.colaborador.uen) {
          $('#uens').removeClass('is-invalid')
          $('#uens').addClass('is-valid')
        }
        else {
          valid = false;
          $('#uens').removeClass('is-valid')
          $('#uens').addClass('is-invalid')
        }
        break;
      case 'departamento':
        if (this.colaborador.departamento) {
          $('#departamentos').removeClass('is-invalid')
          $('#departamentos').addClass('is-valid')
        }
        else {
          valid = false;
          $('#departamentos').removeClass('is-valid')
          $('#departamentos').addClass('is-invalid')
        }
        break;
      case 'puesto':
        if (this.colaborador.puesto) {
          $('#puestos').removeClass('is-invalid')
          $('#puestos').addClass('is-valid')
        }
        else {
          valid = false;
          $('#puestos').removeClass('is-valid')
          $('#puestos').addClass('is-invalid')
        }
        break;

      default:
        if (this.colaborador.nombres) {
          $('#nombresInput').removeClass('is-invalid')
          $('#nombresInput').addClass('is-valid')
        }
        else {
          valid = false;
          $('#nombresInput').removeClass('is-valid')
          $('#nombresInput').addClass('is-invalid')
        }
        if (this.colaborador.apellido_paterno) {
          $('#apellidoPat').removeClass('is-invalid')
          $('#apellidoPat').addClass('is-valid')
        }
        else {
          valid = false;
          $('#apellidoPat').removeClass('is-valid')
          $('#apellidoPat').addClass('is-invalid')
        }
        if (this.colaborador.apellido_materno) {
          $('#apellidoMat').removeClass('is-invalid')
          $('#apellidoMat').addClass('is-valid')
        }
        else {
          valid = false;
          $('#apellidoMat').removeClass('is-valid')
          $('#apellidoMat').addClass('is-invalid')
        }
        if (this.colaborador.uen) {
          $('#uens').removeClass('is-invalid')
          $('#uens').addClass('is-valid')
        }
        else {
          valid = false;
          $('#uens').removeClass('is-valid')
          $('#uens').addClass('is-invalid')
        }
        if (this.colaborador.departamento) {
          $('#departamentos').removeClass('is-invalid')
          $('#departamentos').addClass('is-valid')
        }
        else {
          valid = false;
          $('#departamentos').removeClass('is-valid')
          $('#departamentos').addClass('is-invalid')
        }
        if (this.colaborador.puesto) {
          $('#puestos').removeClass('is-invalid')
          $('#puestos').addClass('is-valid')
        }
        else {
          valid = false;
          $('#puestos').removeClass('is-valid')
          $('#puestos').addClass('is-invalid')
        }
        break;
    }
    return valid
  }

  checkFormEC(element) {
    let valid = true

    switch (element) {
      case 'nombres':
        if (this.colabEditing.nombres) {
          $('#nombresInputEC').removeClass('is-invalid')
          $('#nombresInputEC').addClass('is-valid')
        }
        else {
          valid = false;
          $('#nombresInputEC').removeClass('is-valid')
          $('#nombresInputEC').addClass('is-invalid')
        }
        break;
      case 'apellido_p':
        if (this.colabEditing.apellido_p) {
          $('#apellidoPatEC').removeClass('is-invalid')
          $('#apellidoPatEC').addClass('is-valid')
        }
        else {
          valid = false;
          $('#apellidoPatEC').removeClass('is-valid')
          $('#apellidoPatEC').addClass('is-invalid')
        }
        break;
      case 'apellido_m':
        if (this.colabEditing.apellido_m) {
          $('#apellidoMatEC').removeClass('is-invalid')
          $('#apellidoMatEC').addClass('is-valid')
        }
        else {
          valid = false;
          $('#apellidoMatEC').removeClass('is-valid')
          $('#apellidoMatEC').addClass('is-invalid')
        }
        break;
      case 'uen':
        if (this.colabEditing.uen) {
          $('#uensEC').removeClass('is-invalid')
          $('#uensEC').addClass('is-valid')
        }
        else {
          valid = false;
          $('#uensEC').removeClass('is-valid')
          $('#uensEC').addClass('is-invalid')
        }
        break;
      case 'departamento':
        if (this.colabEditing.departamento) {
          $('#departamentosEC').removeClass('is-invalid')
          $('#departamentosEC').addClass('is-valid')
        }
        else {
          valid = false;
          $('#departamentosEC').removeClass('is-valid')
          $('#departamentosEC').addClass('is-invalid')
        }
        break;
      case 'puesto':
        if (this.colabEditing.puesto) {
          $('#puestosEC').removeClass('is-invalid')
          $('#puestosEC').addClass('is-valid')
        }
        else {
          valid = false;
          $('#puestosEC').removeClass('is-valid')
          $('#puestosEC').addClass('is-invalid')
        }
        break;

      default:
        if (this.colabEditing.nombres) {
          $('#nombresInputEC').removeClass('is-invalid')
          $('#nombresInputEC').addClass('is-valid')
        }
        else {
          valid = false;
          $('#nombresInputEC').removeClass('is-valid')
          $('#nombresInputEC').addClass('is-invalid')
        }
        if (this.colabEditing.apellido_p) {
          $('#apellidoPatEC').removeClass('is-invalid')
          $('#apellidoPatEC').addClass('is-valid')
        }
        else {
          valid = false;
          $('#apellidoPatEC').removeClass('is-valid')
          $('#apellidoPatEC').addClass('is-invalid')
        }
        if (this.colabEditing.apellido_m) {
          $('#apellidoMatEC').removeClass('is-invalid')
          $('#apellidoMatEC').addClass('is-valid')
        }
        else {
          valid = false;
          $('#apellidoMatEC').removeClass('is-valid')
          $('#apellidoMatEC').addClass('is-invalid')
        }
        if (this.colabEditing.uen) {
          $('#uensEC').removeClass('is-invalid')
          $('#uensEC').addClass('is-valid')
        }
        else {
          valid = false;
          $('#uensEC').removeClass('is-valid')
          $('#uensEC').addClass('is-invalid')
        }
        if (this.colabEditing.departamento) {
          $('#departamentosEC').removeClass('is-invalid')
          $('#departamentosEC').addClass('is-valid')
        }
        else {
          valid = false;
          $('#departamentosEC').removeClass('is-valid')
          $('#departamentosEC').addClass('is-invalid')
        }
        if (this.colabEditing.puesto) {
          $('#puestosEC').removeClass('is-invalid')
          $('#puestosEC').addClass('is-valid')
        }
        else {
          valid = false;
          $('#puestosEC').removeClass('is-valid')
          $('#puestosEC').addClass('is-invalid')
        }
        break;
    }

    return valid
  }

  checkFormE(element) {

    let valid = true

    switch (element) {
      case 'equipo':
        if (this.equipo.equipo) {
          $('#modeloInput').removeClass('is-invalid')
          $('#modeloInput').addClass('is-valid')
        }
        else {
          valid = false;
          $('#modeloInput').removeClass('is-valid')
          $('#modeloInput').addClass('is-invalid')
        }
        break;
      case 'propiedad':
        if (this.equipo.propiedad) {
          $('#propiedadInput').removeClass('is-invalid')
          $('#propiedadInput').addClass('is-valid')
        }
        else {
          valid = false;
          $('#propiedadInput').removeClass('is-valid')
          $('#propiedadInput').addClass('is-invalid')
        }
        break;
      case 'tipo':
        if (this.equipo.tipo) {
          $('#tipoEquipoInput').removeClass('is-invalid')
          $('#tipoEquipoInput').addClass('is-valid')
        }
        else {
          valid = false;
          $('#tipoEquipoInput').removeClass('is-valid')
          $('#tipoEquipoInput').addClass('is-invalid')
        }
        break;
      case 'marca':
        if (this.equipo.marca) {
          $('#marcaEquipoInput').removeClass('is-invalid')
          $('#marcaEquipoInput').addClass('is-valid')
        }
        else {
          valid = false;
          $('#marcaEquipoInput').removeClass('is-valid')
          $('#marcaEquipoInput').addClass('is-invalid')
        }
        break;
      case 'descripcion':
        if (this.equipo.descripcion) {
          $('#descripcionTA').removeClass('is-invalid')
          $('#descripcionTA').addClass('is-valid')
        }
        else {
          valid = false;
          $('#descripcionTA').removeClass('is-valid')
          $('#descripcionTA').addClass('is-invalid')
        }
        break;

      default:
        if (this.equipo.equipo) {
          $('#modeloInput').removeClass('is-invalid')
          $('#modeloInput').addClass('is-valid')
        }
        else {
          valid = false;
          $('#modeloInput').removeClass('is-valid')
          $('#modeloInput').addClass('is-invalid')
        }
        if (this.equipo.propiedad) {
          $('#propiedadInput').removeClass('is-invalid')
          $('#propiedadInput').addClass('is-valid')
        }
        else {
          valid = false;
          $('#propiedadInput').removeClass('is-valid')
          $('#propiedadInput').addClass('is-invalid')
        }
        if (this.equipo.tipo) {
          $('#tipoEquipoInput').removeClass('is-invalid')
          $('#tipoEquipoInput').addClass('is-valid')
        }
        else {
          valid = false;
          $('#tipoEquipoInput').removeClass('is-valid')
          $('#tipoEquipoInput').addClass('is-invalid')
        }
        if (this.equipo.marca) {
          $('#marcaEquipoInput').removeClass('is-invalid')
          $('#marcaEquipoInput').addClass('is-valid')
        }
        else {
          valid = false;
          $('#marcaEquipoInput').removeClass('is-valid')
          $('#marcaEquipoInput').addClass('is-invalid')
        }
        if (this.equipo.descripcion) {
          $('#descripcionTA').removeClass('is-invalid')
          $('#descripcionTA').addClass('is-valid')
        }
        else {
          valid = false;
          $('#descripcionTA').removeClass('is-valid')
          $('#descripcionTA').addClass('is-invalid')
        }
        break;
    }

    return valid
  }

  checkFormEE(element) {

    let valid = true

    switch (element) {
      case 'equipo':
        if (this.equipoEditing.equipo) {
          $('#modeloInputEE').removeClass('is-invalid')
          $('#modeloInputEE').addClass('is-valid')
        }
        else {
          valid = false;
          $('#modeloInputEE').removeClass('is-valid')
          $('#modeloInputEE').addClass('is-invalid')
        }
        break;
      case 'propiedad':
        if (this.equipoEditing.propiedad) {
          $('#propiedadInputEE').removeClass('is-invalid')
          $('#propiedadInputEE').addClass('is-valid')
        }
        else {
          valid = false;
          $('#propiedadInputEE').removeClass('is-valid')
          $('#propiedadInputEE').addClass('is-invalid')
        }
        break;
      case 'tipo':
        if (this.equipoEditing.tipo) {
          $('#tipoEquipoInputEE').removeClass('is-invalid')
          $('#tipoEquipoInputEE').addClass('is-valid')
        }
        else {
          valid = false;
          $('#tipoEquipoInputEE').removeClass('is-valid')
          $('#tipoEquipoInputEE').addClass('is-invalid')
        }
        break;
      case 'marca':
        if (this.equipoEditing.marca) {
          $('#marcaEquipoInputEE').removeClass('is-invalid')
          $('#marcaEquipoInputEE').addClass('is-valid')
        }
        else {
          valid = false;
          $('#marcaEquipoInputEE').removeClass('is-valid')
          $('#marcaEquipoInputEE').addClass('is-invalid')
        }
        break;
      case 'descripcion':
        if (this.equipoEditing.descripcion) {
          $('#descripcionTAEE').removeClass('is-invalid')
          $('#descripcionTAEE').addClass('is-valid')
        }
        else {
          valid = false;
          $('#descripcionTAEE').removeClass('is-valid')
          $('#descripcionTAEE').addClass('is-invalid')
        }
        break;
      default:
        if (this.equipoEditing.equipo) {
          $('#modeloInputEE').removeClass('is-invalid')
          $('#modeloInputEE').addClass('is-valid')
        }
        else {
          valid = false;
          $('#modeloInputEE').removeClass('is-valid')
          $('#modeloInputEE').addClass('is-invalid')
        }
        if (this.equipoEditing.propiedad) {
          $('#propiedadInputEE').removeClass('is-invalid')
          $('#propiedadInputEE').addClass('is-valid')
        }
        else {
          valid = false;
          $('#propiedadInputEE').removeClass('is-valid')
          $('#propiedadInputEE').addClass('is-invalid')
        }
        if (this.equipoEditing.tipo) {
          $('#tipoEquipoInputEE').removeClass('is-invalid')
          $('#tipoEquipoInputEE').addClass('is-valid')
        }
        else {
          valid = false;
          $('#tipoEquipoInputEE').removeClass('is-valid')
          $('#tipoEquipoInputEE').addClass('is-invalid')
        }
        if (this.equipoEditing.marca) {
          $('#marcaEquipoInputEE').removeClass('is-invalid')
          $('#marcaEquipoInputEE').addClass('is-valid')
        }
        else {
          valid = false;
          $('#marcaEquipoInputEE').removeClass('is-valid')
          $('#marcaEquipoInputEE').addClass('is-invalid')
        }
        if (this.equipoEditing.descripcion) {
          $('#descripcionTAEE').removeClass('is-invalid')
          $('#descripcionTAEE').addClass('is-valid')
        }
        else {
          valid = false;
          $('#descripcionTAEE').removeClass('is-valid')
          $('#descripcionTAEE').addClass('is-invalid')
        }
        break;
    }
    return valid
  }

  getUens() {
    this.usuariosService.getUens().subscribe(
      res => {
        this.uens = res
      },
      err => console.error(err)
    )
  }

  eliminaColab(idColab) {
    this.colabAEliminar = idColab
    $('#eliminaColabModal').modal('show')
  }

  eliminarColaborador() {
    if (this.eliminaColaborador == 1) {
      this.usuariosService.disableColab({ id: this.colabAEliminar }).subscribe(
        res => {
          if (res) {
            this.destroyTableColabs()
            this.getColaboradores()
            $('#eliminaColabModal').modal('hide')
            this.showModal(3, 'Usuario eliminado', 'El usuario fue deshabilitado correctamente')
          }
        },
        err => console.error(err)
      )
    }
    else {
      $('#eliminaColabModal').modal('hide')
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

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
    this.dtTriggerE.unsubscribe();
    this.dtTriggerChasEA.unsubscribe();
    this.dtTriggerChasENA.unsubscribe();
  }

  getPuestos() {
    this.usuariosService.getPuestos().subscribe(
      res => {
        this.puestos = res
      },
      err => console.error(err)
    )
  }

  getDeptos() {
    this.usuariosService.getDeptos().subscribe(
      res => {
        this.departamentos = res
      },
      err => console.error(err)
    )
  }

  uenChanged(uenSelected) {
    let uen = this.uens.find(uens => uens.uen === uenSelected)
    this.colaborador.uen = ((uen) ? (uen.id) : (null))
    this.checkForm('uen')
  }

  puestoChanged(puestoSelected) {
    let puesto = this.puestos.find(puestos => puestos.puesto === puestoSelected)
    this.colaborador.puesto = ((puesto) ? (puesto.id) : (null))
    this.checkForm('puesto')
  }

  deptoChanged(deptoSelected) {
    let depto = this.departamentos.find(departamentos => departamentos.depto === deptoSelected)
    this.colaborador.departamento = ((depto) ? (depto.id) : (null))
    this.checkForm('departamento')
  }

  colabHasEqInputChange(colaborador) {
    let colab = this.colaboradores.find(colaboradores => colaboradores.nombre === colaborador)
    let colabId = ((colab) ? (colab.idempleado) : (null))
    this.destroyTablesChasEq()
    this.getEquiposColab(colabId)
  }

  getEquiposColab(colabId) {
    this.loadingChasE = true;
    this.colabAsignando = colabId;
    if (this.colabAsignando) {
      this.equiposService.getEquiposFormngEq({ idusuario: colabId }).subscribe(
        res => {
          this.equiposResponse = res
          this.equiposAsignados = [...this.equiposResponse.asignados]
          this.equiposNoAsignados = [...this.equiposResponse.noasignados]
          this.dtTriggerChasEA.next();
          this.dtTriggerChasENA.next();
          this.loadingChasE = false
        },
        err => console.error(err)
      )
    }
    else {
      this.loadingChasE = false;
    }
  }

  destroyTablesChasEq() {
    let table1 = $('#tablaEquiposAsignados').DataTable();
    table1.destroy();
    let table2 = $('#tablaEquiposNoAsignados').DataTable();
    table2.destroy();
  }

  asignarEquipo(equipo) {
    this.equipoAsignando = { ...equipo }
    $('#asignaEquipoModal').modal('show')
  }

  asignaEquipo() {
    this.loadingAE = true;
    this.equipoAsignando.fechaAsign = ((this.equipoAsignando.fecha_asign) ? ((this.equipoAsignando.fecha_asign.year).toString() + '-' + (this.equipoAsignando.fecha_asign.month).toString() + '-' + (this.equipoAsignando.fecha_asign.day).toString()) : (null))
    this.equipoAsignando.idempleado = this.colabAsignando
    if (this.equipoAsignando.fechaAsign && this.equipoAsignando.idequipo && this.equipoAsignando.responsiva != null && this.equipoAsignando.idempleado) {
      this.equiposService.asignarEquipo(this.equipoAsignando).subscribe(
        res => {
          if (res) {
            this.destroyTablesChasEq()
            this.getEquiposColab(this.colabAsignando)
            this.equipoAsignando = {};
            this.loadingAE = false;
            $('#asignaEquipoModal').modal('hide')
            this.showModal(3, 'Registro exitoso', 'El equipo se asignó correctamente')
          }
        },
        err => { console.error(err); this.loadingAE = false; }
      )
    }
    else {
      this.loadingAE = false;
      alert('Faltan datos de la asignación')
    }
  }

  desasignarEquipo(equipo) {
    this.equipoDesasignando = { ...equipo }
    $('#desAsignaEquipoModal').modal('show')
  }

  desAsignaEquipo() {
    this.loadingDAE = true;
    this.equipoDesasignando.fecha_desasign = ((this.equipoDesasignando.fecha_desasign) ? ((this.equipoDesasignando.fecha_desasign.year).toString() + '-' + (this.equipoDesasignando.fecha_desasign.month).toString() + '-' + (this.equipoDesasignando.fecha_desasign.day).toString()) : (null))
    if (this.equipoDesasignando.fecha_desasign && this.equipoDesasignando.idequipo && this.equipoDesasignando.id_c_has_e) {
      this.equiposService.desAsignarEquipo(this.equipoDesasignando).subscribe(
        res => {
          this.destroyTablesChasEq()
          this.getEquiposColab(this.colabAsignando)
          this.equipoDesasignando = {};
          this.loadingDAE = false;
          $('#desAsignaEquipoModal').modal('hide')
          this.showModal(3, 'Registro exitoso', 'El equipo se desasignó correctamente')
        },
        err => { console.error(err); this.loadingDAE = false; }
      )
    }
    else {
      this.loadingDAE = false;
      alert('Faltan datos de la desasignación')
    }
  }
}
