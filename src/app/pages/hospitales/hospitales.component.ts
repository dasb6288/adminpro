import { Component, OnInit } from '@angular/core';
import { HospitalService } from 'src/app/services/hospital/hospital.service';
import { Hospital } from '../models/hospital.model';
import Swal from 'sweetalert2';
import { ModalUploadService } from 'src/app/components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: []
})
export class HospitalesComponent implements OnInit {

  hospitales: Hospital[] = [];
  desde: number = 0;
  cargando: boolean = true;

  constructor(
    public hospitalService: HospitalService,
    public modalUploadService: ModalUploadService) { }

  ngOnInit() {
    this.cargarHospitales();

    this.modalUploadService.notificacion
      .subscribe(() => this.cargarHospitales());
  }

  cambiarDesde(valor: number) {
    const desde = this.desde + valor;

    if (desde >= this.hospitalService.totalHospitales) {
      return;
    }
    if (desde < 0) {
      return;
    }
    this.desde += valor;
    this.cargarHospitales();
  }

  cargarHospitales() {
    this.hospitalService.cargarHospitales(this.desde)
      .subscribe(hospitales => {
        this.hospitales = hospitales;

        this.cargando = false;
      });
  }

  buscarHospital(termino: string) {
    if (termino.length <= 0) {
      this.cargarHospitales();
      return;
    }
    this.cargando = true;
    this.hospitalService.buscarHospital(termino)
      .subscribe(hospitales => {
        this.hospitales = hospitales;

        this.cargando = false;
      });
  }

  guardarHospital(hospital: any) {
    this.hospitalService.actualizarHospital(hospital)
      .subscribe();
  }

  borrarHospital(hospital: Hospital) {
    this.hospitalService.borrarHospital(hospital._id)
      .subscribe(() => this.cargarHospitales());
  }

  crearHospital() {
    Swal.fire({
      title: 'Crear Hospital',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      showLoaderOnConfirm: true
    }).then((result) => {
      if (!result.value || result.value.length === 0) {
        return;
      }
      this.hospitalService.crearHospital(result.value)
        .subscribe(() => this.cargarHospitales());
    });
  }

  actualizarImagen(hospital: Hospital) {
    this.modalUploadService.mostrarModal('hospitales', hospital._id);
  }

}
