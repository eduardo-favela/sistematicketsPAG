import { Component, OnInit } from '@angular/core';
import { LoginservicesService } from 'src/app/services/loginservices.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private loginServicesService: LoginservicesService, private location: Location, private router: Router) { }

  usuario = {
    user: null,
    pass: null,
  }
  id_departamento: any = null
  isDisabled: boolean = true
  loaderhidden: boolean = true
  btnDisabled: boolean = false
  public sessionStorage = sessionStorage

  ngOnInit(): void {
  }

  login() {
    this.loaderhidden = false
    this.btnDisabled = true
    this.isDisabled = true
    if (this.usuario.user && this.usuario.pass) {
      this.loginServicesService.login(this.usuario).subscribe(
        res => {
          if (res) {
            this.loginServicesService.getDeptoId({ user: this.usuario.user }).subscribe(
              res => {
                this.id_departamento = res
                sessionStorage.setItem('user', this.usuario.user)
                sessionStorage.setItem('depto', this.id_departamento)
                this.isDisabled = true
                this.loaderhidden = true
              },
              err => console.error(err)
            )
          }
          else {
            this.btnDisabled = false
            this.loaderhidden = true
            this.isDisabled = false
          }
        },
        err => console.error(err)
      )
    }
    else {
      this.btnDisabled = false
      this.loaderhidden = true
      this.isDisabled = false
    }
  }
}
