import { Component, Inject, Injectable, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { on } from 'events';
import { Location } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {


  constructor(private location: Location, private router: Router) { }

  title = 'client';
  curDate: Date = new Date()
  public sessionStorage = sessionStorage;
  estatussidebar: string = 'Ocultar'
  status: boolean = false;

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    switch (this.location.path()) {
      case '/':
        $('#generarTicket').addClass('active');
        $('#gestionarTicket').removeClass('active');
        $('#getsionarUsuario').removeClass('active');
        $('#gestionarServicios').removeClass('active');
        $('#gestionarColabs').removeClass('active');
        break;
      case '/vereportes':
        $('#generarTicket').removeClass('active');
        $('#gestionarTicket').addClass('active');
        $('#getsionarUsuario').removeClass('active');
        $('#gestionarServicios').removeClass('active');
        $('#gestionarColabs').removeClass('active');
        break;
      case '/mngusuarios':
        $('#generarTicket').removeClass('active');
        $('#gestionarTicket').removeClass('active');
        $('#getsionarUsuario').addClass('active');
        $('#gestionarServicios').removeClass('active');
        $('#gestionarColabs').removeClass('active');
        break;
      case '/mngservicios':
        $('#generarTicket').removeClass('active');
        $('#gestionarTicket').removeClass('active');
        $('#getsionarUsuario').removeClass('active');
        $('#gestionarServicios').addClass('active');
        $('#gestionarColabs').removeClass('active');
        break;
      case '/mngcolaboradores':
        $('#generarTicket').removeClass('active');
        $('#gestionarTicket').removeClass('active');
        $('#getsionarUsuario').removeClass('active');
        $('#gestionarServicios').removeClass('active');
        $('#gestionarColabs').addClass('active');
        break;

      default:
        break;
    }
  }

  clickEvent() {
    this.status = !this.status;
    if (this.estatussidebar == 'Ocultar') {
      this.estatussidebar = 'Mostrar'
    }
    else {
      this.estatussidebar = 'Ocultar'
    }
  }

  cerrarSesion() {
    sessionStorage.clear();
    this.location.replaceState('/');
    this.router.navigate(['/'])
  }
}
