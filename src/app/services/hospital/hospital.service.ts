import { Injectable } from '@angular/core';
import { Hospital } from 'src/app/pages/models/hospital.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from 'src/app/config/config';
import { map } from 'rxjs/operators';
import { UsuarioService } from '../usuario/usuario.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  totalHospitales: number = 0;

  constructor(
    public http: HttpClient,
    public usuarioService: UsuarioService) { }

  cargarHospitales(desde: number = 0) {
    const url = `${URL_SERVICIOS}/hospital?desde=${desde}`;

    return this.http.get(url)
      .pipe(map((res: any) => {
        this.totalHospitales = res.total;
        return res.hospitales;
      }));
  }

  obtenerHospital(id: string) {
    const url = `${URL_SERVICIOS}/hospital/${id}`;

    return this.http.get(url)
      .pipe(map((res: any) => {
        return res.hospital;
      }));
  }

  borrarHospital(id: string) {
    const url = `${URL_SERVICIOS}/hospital/${id}?token=${this.usuarioService.token}`;

    return this.http.delete(url)
      .pipe(map(res => {
        Swal.fire(
          'Eliminado!',
          'El hospital ha sido eliminado.',
          'success'
        );
        return true;
      }));
  }

  crearHospital(nombre: string) {
    const url = `${URL_SERVICIOS}/hospital?token=${this.usuarioService.token}`;

    return this.http.post(url, { nombre })
      .pipe(map((res: any) => {
        Swal.fire({
          type: 'success',
          title: 'Hospital creado',
          text: res.hospital.nombre
        });
        return res.hospital;
      }));
  }

  buscarHospital(termino: string) {
    const url = `${URL_SERVICIOS}/busqueda/coleccion/hospitales/${termino}`;

    return this.http.get(url)
      .pipe(map((res: any) => {
        return res.hospitales;
      }));
  }

  actualizarHospital(hospital: Hospital) {
    const url = `${URL_SERVICIOS}/hospital/${hospital._id}?token=${this.usuarioService.token}`;

    return this.http.put(url, hospital)
      .pipe(map((res: any) => {
        Swal.fire({
          type: 'success',
          title: 'Hospital actualizado',
          text: res.hospital.nombre
        });
        return res.hospital;
      }));
  }

}
