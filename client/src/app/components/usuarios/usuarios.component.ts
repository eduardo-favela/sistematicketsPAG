import { Component, OnInit, ViewChild } from '@angular/core';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { LoginservicesService } from 'src/app/services/loginservices.service';

import * as $ from 'jquery'

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  ///////////////////////////////////AUTOCOMPLETES///////////////////////////////////
  keywordUsuarios = 'nombre'
  usuarios: any = []
  placeholderUsuario = 'Busca un colaborador...'
  inputsDisabled = false
  @ViewChild('inputUsuario') inputUsuario;
  ///////////////////////////////////AUTOCOMPLETES///////////////////////////////////

  usuario: any = {
    user: null,
    pass: null,
    empleados_idempleado: null,
    tipo_usuario: null
  }

  responseSetUser: any
  tiposUsuario: any = []

  constructor(private usuariosService: UsuariosService, private loginServicesService: LoginservicesService) { }

  ngOnInit(): void {
    this.getUsuarios()
    this.getTiposUsuario()
  }

  getTiposUsuario() {
    this.usuariosService.getTiposUsuarios().subscribe(
      tiposUsuarios => {
        this.tiposUsuario = tiposUsuarios
      },
      err => console.error(err)
    )
  }

  getUsuarios() {
    this.usuariosService.getUsuarios().subscribe(
      res => {
        this.usuarios = res
      },
      err => console.error(err)
    )
  }

  registrarUsuario() {
    if (!this.usuario.user || !this.usuario.pass || !this.usuario.empleados_idempleado || !this.usuario.tipo_usuario) {
      $('#motivoErrorHeader').html('Faltan datos')
      $('#motivoErrorContent').html(`<i class='fas fa-exclamation-triangle mr-2'></i>Se deben
      llenar todos los campos para registrar un usuario.`)
      $('#errorUsuarioModal').modal('show')
    }
    else {
      this.loginServicesService.setUser(this.usuario).subscribe(
        res => {
          this.responseSetUser = res

          if (this.responseSetUser) {
            this.inputUsuario.clear()
            this.usuario.user = null
            this.usuario.pass = null
            this.usuario.empleados_idempleado = null
            this.usuario.tipo_usuario = null
            $('#nuevoUsuarioModal').modal('show')
          }
          else {
            $('#motivoErrorHeader').html('Usuario duplicado')
            $('#motivoErrorContent').html(`<i class='fas fa-exclamation-triangle mr-2'></i>El nombre de usuario ingresado, ya existe.`)
            $('#errorUsuarioModal').modal('show')
          }
        },
        err => console.error(err)
      )
    }
  }

  ///////////////////////////////////AUTOCOMPLETES///////////////////////////////////
  selectEventUsuario(item) {
    this.usuario.empleados_idempleado = item.idempleado
  }

  onChangeSearch(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }

  onCleared(e) {
    this.inputUsuario.close()
  }

  onFocusedUsuario(e) {
    // do something when input is focused
    this.inputUsuario.open()
  }
  ///////////////////////////////////AUTOCOMPLETES///////////////////////////////////
}
