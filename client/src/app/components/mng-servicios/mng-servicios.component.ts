import { Component, OnInit } from '@angular/core';
import { ServiciosService } from 'src/app/services/servicios.service';

@Component({
  selector: 'app-mng-servicios',
  templateUrl: './mng-servicios.component.html',
  styleUrls: ['./mng-servicios.component.css']
})
export class MngServiciosComponent implements OnInit {

  constructor(private serviciosService: ServiciosService) { }

  servicios: any = []

  servicio = null;

  servicioNew: any = {
    servicio: null,
    asignar_equipo: null,
    depto: null
  }

  deptosistemas: any = []
  tipoServicioNew: any = {
    tiposervicio: null
  }

  tipoServicios: any = []

  servicioHasTipo: any = []

  ngOnInit(): void {
    this.getdeptosSistemas()
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
    if (this.servicioNew.servicio && this.servicioNew.asignar_equipo!=null && this.servicioNew.depto) {
      this.servicioNew.servicio=this.servicioNew.servicio.toString().toUpperCase().trim()
      this.serviciosService.setServicio(this.servicioNew).subscribe(
        res => {
          if (res) {
            this.servicioNew.asignar_equipo=null
            this.servicioNew.asignar_equipo=null
            this.servicioNew.depto=null
            $('#headerModal').html('Registro guardado')
            $('#descripctionP').html('<i class="fas fa-check-circle mr-2"></i>El servicio se guardó exitosamente')
            $('#successModal').modal('show')
          }
          else {
            $('#headerModalError').html('Advertencia')
            $('#descripcionPSuccess').html('<i class="mr-2 fa fa-exclamation-triangle" aria-hidden="true"></i>El servicio ya existe')
            $('#advertenciaModal').modal('show')
          }
        },
        err => console.error(err)
      )
    }
    else{
      $('#headerModalError').html('Advertencia')
      $('#descripcionPSuccess').html('<i class="mr-2 fa fa-exclamation-triangle" aria-hidden="true"></i>Debe llenar todos los campos para registrar un servicio')
      $('#advertenciaModal').modal('show')
    }
  }

  //AGREGAR ELEMENTO A LA RELACIÓN ENTRE EL SERVICIO Y EL TIPO DE SERVICIO
  addElement(item: any) {
    if (this.servicio) {
      let index = this.tipoServicios.findIndex(servicio => servicio.id_servicio == item.id_servicio)
      let elementSpliced = this.tipoServicios.splice(index, 1)[0];
      elementSpliced.idServicio = this.servicio
      this.servicioHasTipo.push(elementSpliced)
    }
    else {
      $('#descripcionPSuccess').html('Advertencia')
      $('#headerModalError').html('<i class="mr-2 fa fa-exclamation-triangle" aria-hidden="true"></i>Se debe seleccionar un servicio')
      $('#advertenciaModal').modal('show')
    }
  }

  //ELIMINAR ELEMENTO DE LA RELACIÓN ENTRE EL SERVICIO Y EL TIPO DE SERVICIO
  deleteElement(item: any) {
    let index = this.servicioHasTipo.findIndex(servicio => servicio.id_servicio == item.id_servicio)
    let elementSpliced = this.servicioHasTipo.splice(index, 1)[0];
    //ELIMINAR LA PROPIEDAD DEL OBJETO PARA REGRESARLO AL ARREGLO
    delete elementSpliced.idServicio
    this.tipoServicios.push(elementSpliced)
  }
}
