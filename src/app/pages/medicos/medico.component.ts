import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Hospital } from '../models/hospital.model';
import { MedicoService } from 'src/app/services/medico/medico.service';
import { HospitalService } from 'src/app/services/hospital/hospital.service';
import { Medico } from '../models/medico.model';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalUploadService } from 'src/app/components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: []
})
export class MedicoComponent implements OnInit {

  hospitales: Hospital[] = [];
  medico: Medico = new Medico('', '', '', '', '');
  hospital: Hospital = new Hospital('');

  constructor(
    public medicoService: MedicoService,
    public hospitalService: HospitalService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public modalUploadService: ModalUploadService) {
    this.activatedRoute.params
      .subscribe(params => {
        const id = params.id;
        if (id !== 'nuevo') {
          this.cargarMedico(id);
        }
      });
  }

  ngOnInit() {
    this.hospitalService.cargarHospitales()
      .subscribe(hospitales => {
        this.hospitales = hospitales;
      });

    this.modalUploadService.notificacion
      .subscribe(res => {
        this.medico.img = res.medico.img;
      });
  }

  cargarMedico(id: string) {
    this.medicoService.cargarMedico(id)
      .subscribe(medico => {
        this.medico = medico;
        this.medico.hospital = medico.hospital._id;
        this.cambioHospital(this.medico.hospital);
      });
  }

  guardarMedico(frm: NgForm) {
    if (!frm.valid) {
      return;
    }
    this.medicoService.guardarMedico(this.medico)
      .subscribe((medico: any) => {
        this.medico._id = medico._id;
        this.router.navigate(['/medico', this.medico._id]);
      });
  }

  cambioHospital(id: string) {
    this.hospitalService.obtenerHospital(id)
      .subscribe(hospital => {
        this.hospital = hospital ? hospital : new Hospital('');
      });
  }

  cambiarFoto() {
    this.modalUploadService.mostrarModal('medicos', this.medico._id);
  }

}
