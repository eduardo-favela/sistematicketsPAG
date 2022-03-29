import { Component, Inject, Injectable, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { on } from 'events';
import { Location } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit{


  constructor( private location:Location, private router:Router) { }

  title = 'client';
  curDate: Date = new Date()
  public sessionStorage=sessionStorage;
  estatussidebar : string = 'Ocultar'
  status : boolean = false;

  ngOnInit():void{
  }

  clickEvent(){
    this.status = !this.status;
    if(this.estatussidebar=='Ocultar'){
      this.estatussidebar='Mostrar'
    }
    else{
      this.estatussidebar='Ocultar'
    }
  }

  cerrarSesion(){
    sessionStorage.clear();
    this.location.replaceState('/');
    this.router.navigate(['/'])
  }
}
