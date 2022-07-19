import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { EstadisticosService } from 'src/app/services/estadisticos.service';

@Component({
  selector: 'app-estadisticos',
  templateUrl: './estadisticos.component.html',
  styleUrls: ['./estadisticos.component.css']
})
export class EstadisticosComponent implements OnInit {

  fechaInicial: NgbDate = null
  fechaFinal: NgbDate = new NgbDate(parseInt(moment().format('YYYY')), parseInt(moment().format('MM')), parseInt(moment().format('DD')));

  constructor(private estadisticosService: EstadisticosService) { }

  ngOnInit(): void {
    const current = new Date();
    const prior = new Date().setDate(current.getDate() - 30);
    const lastMonth = new Date(prior)
    this.fechaInicial = new NgbDate(lastMonth.getFullYear(), (lastMonth.getMonth() + 1), lastMonth.getDate());
  }

  fechaChange() {
    this.getStatistics()
  }

  getStatistics() {
    let fecha1 = (moment().format(this.fechaInicial.year.toString() +
      '-' + this.fechaInicial.month.toString() +
      '-' + this.fechaInicial.day.toString()));
    let fecha2 = (moment().format(this.fechaFinal.year.toString() +
      '-' + this.fechaFinal.month.toString() +
      '-' + this.fechaFinal.day.toString()));

    this.estadisticosService.getStatistics({ fecha1: fecha1, fecha2: fecha2 }).subscribe(
      res => {
        console.log(res)
      },
      err => {
        console.error(err)
      }
    )
  }
}
