import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from 'src/app/config/config';
import { map } from 'rxjs/operators';
import { UsuarioService } from '../usuario/usuario.service';
import Swal from 'sweetalert2';
import { Medico } from 'src/app/pages/models/medico.model';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  totalMedicos: number = 0;

  constructor(
    public http: HttpClient,
    public usuarioService: UsuarioService) { }

  cargarMedicos(desde: number = 0) {
    const url = `${URL_SERVICIOS}/medico?desde=${desde}`;

    return this.http.get(url)
      .pipe(map((res: any) => {
        this.totalMedicos = res.total;

        return res.medicos;
      }));
  }

  cargarMedico(id: string) {
    const url = `${URL_SERVICIOS}/medico/${id}`;

    return this.http.get(url)
      .pipe(map((res: any) => {
        return res.medico;
      }));
  }

  buscarMedicos(termino: string) {
    const url = `${URL_SERVICIOS}/busqueda/coleccion/medicos/${termino}`;

    return this.http.get(url)
      .pipe(map((res: any) => {
        return res.medicos;
      }));
  }

  borrarMedico(id: string) {
    const url = `${URL_SERVICIOS}/medico/${id}?token=${this.usuarioService.token}`;

    return this.http.delete(url)
      .pipe(map(res => {
        Swal.fire(
          'Eliminado!',
          'El Médico ha sido eliminado.',
          'success'
        );
        return true;
      }));
  }

  guardarMedico(medico: Medico) {
    let url = `${URL_SERVICIOS}/medico`;
    if (medico._id) {
      url += `/${medico._id}`;
      url += `?token=${this.usuarioService.token}`;

      return this.http.put(url, medico)
        .pipe(map((res: any) => {
          Swal.fire(
            'Médico actualizado!',
            medico.nombre,
            'success'
          );
          return res.medico;
        }));
    } else {
      url += `?token=${this.usuarioService.token}`;

      return this.http.post(url, medico)
        .pipe(map((res: any) => {
          Swal.fire(
            'Médico creado!',
            medico.nombre,
            'success'
          );
          return res.medico;
        }));
    }
  }

}
