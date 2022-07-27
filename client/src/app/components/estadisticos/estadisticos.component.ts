import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { EstadisticosService } from 'src/app/services/estadisticos.service';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';


@Component({
  selector: 'app-estadisticos',
  templateUrl: './estadisticos.component.html',
  styleUrls: ['./estadisticos.component.css']
})
export class EstadisticosComponent implements OnInit {

  chartTitle: string = ''
  hideFirstLevelCharts: boolean = false
  hideSecondLevelCharts: boolean = true
  hideThirdLevelCharts: boolean = true
  totalChart: number = 0

  tipoServicioData: ChartData<'bar'> = {
    labels: [],
    datasets: []
  };

  actividadData: ChartData<'bar'> = {
    labels: [],
    datasets: []
  };

  tipoServicioDatafilled: ChartData<'bar'> = {
    labels: [],
    datasets: []
  }

  actividadDatafilled: ChartData<'bar'> = {
    labels: [],
    datasets: []
  }

  tipoGrafica: number = 0
  fechaInicial: NgbDate = null
  fechaFinal: NgbDate = new NgbDate(parseInt(moment().format('YYYY')), parseInt(moment().format('MM')), parseInt(moment().format('DD')));
  /* barChartData: ChartData[] = [] */
  barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: []
  };

  barChartDatafilled: ChartData<'bar'> = {
    labels: [],
    datasets: []
  };

  barChartOptions: ChartConfiguration['options'] = {
    responsive: true,

    scales: {
      x: {},
      y: {
        min: 0
      }
    },
    plugins: {
      legend: {
        display: true,
      },
      datalabels: {
        anchor: 'end',
        align: 'end'
      }
    }
  };
  barChartType: ChartType = 'bar'
  barChartPlugins = [
    DataLabelsPlugin
  ];

  constructor(private estadisticosService: EstadisticosService) { }

  ngOnInit(): void {
    const current = new Date();
    const prior = new Date().setDate(current.getDate() - 30);
    const lastMonth = new Date(prior)
    this.fechaInicial = new NgbDate(lastMonth.getFullYear(), (lastMonth.getMonth() + 1), lastMonth.getDate());
    this.getStatistics()
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

    this.estadisticosService.getStatistics({ fecha1: fecha1, fecha2: fecha2, tipoGrafica: this.tipoGrafica }).subscribe(
      res => {
        this.fillChart(res)
      },
      err => {
        console.error(err)
      }
    )
  }
  chartHovered(event) {

  }
  chartClicked(event) {
    if (event.active[0] && this.tipoGrafica == 1) {
      let servicio = this.barChartData.datasets[event.active[0].datasetIndex].label
      let fecha1 = (moment().format(this.fechaInicial.year.toString() +
        '-' + this.fechaInicial.month.toString() +
        '-' + this.fechaInicial.day.toString()));
      let fecha2 = (moment().format(this.fechaFinal.year.toString() +
        '-' + this.fechaFinal.month.toString() +
        '-' + this.fechaFinal.day.toString()));
      this.estadisticosService.getStatsTipoServicio({ fecha1: fecha1, fecha2: fecha2, servicio: servicio }).subscribe(
        res => {
          this.fillChartTS(res)
        },
        err => {
          console.error(err)
        }
      )
    }
  }

  chartTSClicked(event) {
    if (event.active[0] && this.tipoGrafica == 1) {
      let tipoServicio = this.tipoServicioData.datasets[event.active[0].datasetIndex].label
      let fecha1 = (moment().format(this.fechaInicial.year.toString() +
        '-' + this.fechaInicial.month.toString() +
        '-' + this.fechaInicial.day.toString()));
      let fecha2 = (moment().format(this.fechaFinal.year.toString() +
        '-' + this.fechaFinal.month.toString() +
        '-' + this.fechaFinal.day.toString()));
      this.estadisticosService.getStatsActividad({ fecha1: fecha1, fecha2: fecha2, tiposervicio: tipoServicio }).subscribe(
        res => {
          this.fillChartActividad(res)
        },
        err => {
          console.error(err)
        }
      )
    }
  }

  chartAClicked(event) {
    if (event.active[0] && this.tipoGrafica == 1) {

    }
  }

  fillChart(soportes: any) {
    //SE PONE EL ARRAY VACÍO PARA QUE NO SE VAYAN GUARDANDO LOS PRODUCTOS EN EL MISMO ARREGLO
    this.totalChart = 0
    this.barChartData.datasets = []
    this.barChartData.labels = ['Soportes']
    this.hideThirdLevelCharts = true
    this.hideSecondLevelCharts = true
    this.hideFirstLevelCharts = false
    this.chartTitle = this.tipoGrafica == 1 ? 'Gráfica de soportes por área de servicio' : 'Gráfica de soportes por UEN'
    for (let i = 0; i < soportes.length; i++) {
      this.totalChart += soportes[i].cantidad
      if (this.barChartData.datasets.some(e => e.label === soportes[i].label)) {
        for (let j = 0; j < this.barChartData.datasets.length; j++) {
          if (this.barChartData.datasets[j].label == soportes[i].label) {
            for (let k = 0; k < this.barChartData.labels.length; k++) {
              this.barChartData.datasets[j].data[k] = soportes[i].cantidad
            }
            break
          }
        }
      }
      else {
        this.barChartData.datasets.push({ data: [soportes[i].cantidad], label: soportes[i].label })
      }
    }
    this.barChartDatafilled = { ... this.barChartData }
  }

  fillChartTS(soportes: any) {
    //SE PONE EL ARRAY VACÍO PARA QUE NO SE VAYAN GUARDANDO LOS PRODUCTOS EN EL MISMO ARREGLO
    this.totalChart = 0
    this.tipoServicioData.datasets = []
    this.tipoServicioData.labels = ['Soportes']
    this.hideFirstLevelCharts = true;
    this.hideSecondLevelCharts = false;
    this.chartTitle = 'Gráfica de soportes por tipo de servicio'
    for (let i = 0; i < soportes.length; i++) {
      this.totalChart += soportes[i].cantidad
      if (this.tipoServicioData.datasets.some(e => e.label === soportes[i].label)) {
        for (let j = 0; j < this.tipoServicioData.datasets.length; j++) {
          if (this.tipoServicioData.datasets[j].label == soportes[i].label) {
            for (let k = 0; k < this.tipoServicioData.labels.length; k++) {
              this.tipoServicioData.datasets[j].data[k] += soportes[i].cantidad
            }
            break
          }
        }
      }
      else {
        this.tipoServicioData.datasets.push({ data: [soportes[i].cantidad], label: soportes[i].label })
      }
    }
    this.tipoServicioDatafilled = { ... this.tipoServicioData }
  }

  fillChartActividad(soportes: any) {
    //SE PONE EL ARRAY VACÍO PARA QUE NO SE VAYAN GUARDANDO LOS PRODUCTOS EN EL MISMO ARREGLO
    this.totalChart = 0
    this.actividadData.datasets = []
    this.actividadData.labels = ['Soportes']
    this.hideSecondLevelCharts = true;
    this.hideThirdLevelCharts = false;
    this.chartTitle = 'Gráfica de soportes por actividad'
    for (let i = 0; i < soportes.length; i++) {
      this.totalChart += soportes[i].cantidad
      if (this.actividadData.datasets.some(e => e.label === soportes[i].label)) {
        for (let j = 0; j < this.actividadData.datasets.length; j++) {
          if (this.actividadData.datasets[j].label == soportes[i].label) {
            for (let k = 0; k < this.actividadData.labels.length; k++) {
              this.actividadData.datasets[j].data[k] += soportes[i].cantidad
            }
            break
          }
        }
      }
      else {
        this.actividadData.datasets.push({ data: [soportes[i].cantidad], label: soportes[i].label })
      }
    }
    this.actividadDatafilled = { ... this.actividadData }
  }

  downloadCanvas(event: any) {
    // get the `<a>` element from click event
    let anchor = event.target;
    // get the canvas, I'm getting it by tag name, you can do by id
    // and set the href of the anchor to the canvas dataUrl
    anchor.href = document.getElementsByTagName('canvas')[0].toDataURL();
    // set the anchors 'download' attibute (name of the file to be downloaded)
    anchor.download = `Soportes por UEN ${moment().format('DD-MM-YYYY')}.png`;
  }
}
