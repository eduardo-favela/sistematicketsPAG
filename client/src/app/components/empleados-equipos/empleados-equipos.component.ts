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

  colabEditing: any = {}

  uens: any = [];
  puestos: any = [];
  departamentos: any = [];
  colaboradores: any = [];
  marcas: any = [];
  tipos: any = [];

  colabEditingUEN = null;
  colabEditingPuesto = null;
  colabEditingDepto = null;

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
    estatus: null,
    tipo: null,
    marca: null
  }

  colabAEliminar = null
  eliminaColaborador: any = 2

  dtOptions: DataTables.Settings = {};

  dtTrigger: Subject<any> = new Subject<any>();

  constructor(private usuariosService: UsuariosService, private equiposService: EquiposService) { }

  ngOnInit(): void {
    this.getUens()
    this.getPuestos()
    this.getDeptos()
    this.getColaboradores()
    this.getMarcas()
    this.getTipos()
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

  registrarColab() {
    this.loading = true
    if (this.checkForm()) {
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
    if (this.checkFormE()) {
      this.loadingE = false
    }
    else {
      this.loadingE = false
    }
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

  guardarCambiosEC() {
    let uen = this.uens.find(uens => uens.uen === this.colabEditingUEN)
    this.colabEditing.uen = ((uen) ? (uen.id) : (null))
    let depto = this.departamentos.find(departamentos => departamentos.depto === this.colabEditingDepto)
    this.colabEditing.departamento = ((depto) ? (depto.id) : (null))
    let puesto = this.puestos.find(puestos => puestos.puesto === this.colabEditingPuesto)
    this.colabEditing.puesto = ((puesto) ? (puesto.id) : (null))
    if (this.checkFormEC()) {
      this.usuariosService.updateColaborador(this.colabEditing).subscribe(
        res => {
          this.clearFormEC()
          $('#editColabModal').modal('hide')
          this.showModal(3, 'Registro exitoso', 'Los cambios al colaborador se guardaron correctamente')
          this.destroyTableColabs()
          this.getColaboradores()
        },
        err => console.error(err)
      )
    }
  }

  destroyTableColabs() {
    let table = $('#tablaColabs').DataTable()
    table.destroy();
  }

  uenChangedEC(uenSelected) {
    let uen = this.uens.find(uens => uens.uen === uenSelected)
    this.colabEditing.uen = ((uen) ? (uen.id) : (null))
  }

  deptoChangedEC(puestoSelected) {
    let puesto = this.puestos.find(puestos => puestos.puesto === puestoSelected)
    this.colabEditing.puesto = ((puesto) ? (puesto.id) : (null))
  }

  puestoChangedEC(deptoSelected) {
    let depto = this.departamentos.find(departamentos => departamentos.depto === deptoSelected)
    this.colabEditing.departamento = ((depto) ? (depto.id) : (null))
  }

  tipoEqChanged(tipoEquipo) {
    let tipoEq = this.tipos.find(tipos => tipos.tipo_equipo === tipoEquipo)
    this.equipo.tipo = ((tipoEq) ? (tipoEq.idtipo) : (null))
  }

  marcaEqChanged(marcaEquipo) {
    let marcaEq = this.marcas.find(marcas => marcas.marca === marcaEquipo)
    this.equipo.marca = ((marcaEq) ? (marcaEq.id_marca) : (null))
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

  checkForm() {
    let valid = true

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
    return valid
  }

  checkFormEC() {
    let valid = true

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
    return valid
  }

  checkFormE() {
    let valid = true

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
          if(res){
            this.destroyTableColabs()
            $('#eliminaColabModal').modal('hide')
            this.getColaboradores()
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
    this.checkForm()
  }

  puestoChanged(puestoSelected) {
    let puesto = this.puestos.find(puestos => puestos.puesto === puestoSelected)
    this.colaborador.puesto = ((puesto) ? (puesto.id) : (null))
    this.checkForm()
  }

  deptoChanged(deptoSelected) {
    let depto = this.departamentos.find(departamentos => departamentos.depto === deptoSelected)
    this.colaborador.departamento = ((depto) ? (depto.id) : (null))
    this.checkForm()
  }
}
