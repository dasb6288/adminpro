import { Component, OnInit } from '@angular/core';
import { MedicoService } from 'src/app/services/medico/medico.service';
import { Medico } from '../models/medico.model';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: []
})
export class MedicosComponent implements OnInit {

  medicos: Medico[] = [];
  desde: number = 0;

  constructor(public medicoService: MedicoService) { }

  ngOnInit() {
    this.cargarMedicos();
  }

  cargarMedicos() {
    this.medicoService.cargarMedicos(this.desde)
      .subscribe(medicos => {
        this.medicos = medicos;
      });
  }

  buscarMedicos(termino: string) {
    if (!termino || termino.length === 0) {
      this.cargarMedicos();
      return;
    }
    this.medicoService.buscarMedicos(termino)
      .subscribe(medicos => {
        this.medicos = medicos;
      });
  }

  actualizarImagen(medico: Medico) {

  }

  borrarMedico(medico: Medico) {
    this.medicoService.borrarMedico(medico._id)
      .subscribe(() => {
        this.cargarMedicos();
      });
  }

  cambiarDesde(valor: number) {
    const desde = this.desde + valor;

    if (desde >= this.medicoService.totalMedicos) {
      return;
    }
    if (desde < 0) {
      return;
    }
    this.desde += valor;
    this.cargarMedicos();
  }

}
