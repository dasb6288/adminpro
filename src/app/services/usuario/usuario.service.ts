import { Injectable } from '@angular/core';
import { Usuario } from 'src/app/pages/models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from 'src/app/config/config';
import { map, catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuario: Usuario;
  token: string;
  menu: any = [];

  constructor(
    public http: HttpClient,
    public router: Router,
    public subirArchivoService: SubirArchivoService) {
    this.cargarStorage();
  }

  renuevaToken() {
    const url = `${URL_SERVICIOS}/login/renuevatoken?token=${this.token}`;

    return this.http.get(url)
      .pipe(
        map((res: any) => {
          this.token = res.token;
          localStorage.setItem('token', this.token);
          console.log('token renovado');
          return true;
        }),
        catchError(err => {
          this.logOut();
          Swal.fire({
            type: 'error',
            title: 'Error al renovar token',
            text: 'No fue posible renovar el token'
          });
          throw err;
        })
      );
  }

  isLogged() {
    return (this.token.length > 5) ? true : false;
  }

  cargarStorage() {
    if (localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
      this.menu = JSON.parse(localStorage.getItem('menu'));
    } else {
      this.token = '';
      this.usuario = null;
      this.menu = [];
    }
  }

  guardarStorage(id: string, token: string, usuario: Usuario, menu: any) {
    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    localStorage.setItem('menu', JSON.stringify(menu));

    this.usuario = usuario;
    this.token = token;
    this.menu = menu;
  }

  loginGoogle(token: string) {
    const url = URL_SERVICIOS + '/login/google';
    return this.http.post(url, { token })
      .pipe(map((res: any) => {
        this.guardarStorage(res.id, res.token, res.usuario, res.menu);

        return true;
      }));
  }

  login(usuario: Usuario, recordar: boolean = false) {

    if (recordar) {
      localStorage.setItem('email', usuario.email);
    } else {
      localStorage.removeItem('email');
    }
    const url = URL_SERVICIOS + '/login';
    return this.http.post(url, usuario)
      .pipe(
        map((res: any) => {
          this.guardarStorage(res.id, res.token, res.usuario, res.menu);
          return true;
        }),
        catchError(err => {
          Swal.fire({
            type: 'error',
            title: 'Error en el login',
            text: err.error.mensaje
          });
          throw err;
        })
      );
  }

  crearUsuario(usuario: Usuario) {
    const url = URL_SERVICIOS + '/usuario';
    return this.http.post(url, usuario)
      .pipe(
        map((res: any) => {
          Swal.fire({
            type: 'success',
            title: 'Usuario creado',
            text: usuario.email
          });
          return res.usuario;
        }),
        catchError(err => {
          Swal.fire({
            type: 'error',
            title: err.error.mensaje,
            text: err.error.errors.message
          });
          throw err;
        })
      );
  }

  actualizarUsuario(usuario: Usuario) {
    let url = URL_SERVICIOS + '/usuario/' + usuario._id;
    url += '?token=' + this.token;
    // console.log(url);

    return this.http.put(url, usuario)
      .pipe(
        map((res: any) => {
          if (usuario._id === this.usuario._id) {
            const usuarioDB: Usuario = res.usuario;
            this.guardarStorage(usuarioDB._id, this.token, usuarioDB, this.menu);
          }

          Swal.fire({
            type: 'success',
            title: 'Usuario actualizado',
            text: usuario.nombre
          });
          return true;
        }),
        catchError(err => {
          Swal.fire({
            type: 'error',
            title: err.error.mensaje,
            text: err.error.errors.message
          });
          throw err;
        })
      );
  }

  cambiarIamgen(archivo: File, id: string) {
    this.subirArchivoService.subirArchivo(archivo, 'usuarios', id)
      .then((res: any) => {
        console.log(res);
        this.usuario.img = res.usuario.img;
        Swal.fire({
          type: 'success',
          title: 'Imagen actualizada',
          text: this.usuario.nombre
        });
        this.guardarStorage(id, this.token, this.usuario, this.menu);
      })
      .catch(res => {
        console.log(res);

      });
  }

  cargarUsuarios(desde: number = 0) {
    const url = URL_SERVICIOS + '/usuario?desde=' + desde;

    return this.http.get(url);
  }

  buscarUsuario(termino: string) {
    const url = URL_SERVICIOS + '/busqueda/coleccion/usuarios/' + termino;

    return this.http.get(url)
      .pipe(map((res: any) => res.usuarios));
  }

  borrarUsuario(id: string) {
    let url = URL_SERVICIOS + '/usuario/' + id;
    url += '?token=' + this.token;

    return this.http.delete(url)
      .pipe(map(res => {
        Swal.fire(
          'Eliminado!',
          'El usuario ha sido eliminado.',
          'success'
        );
        return true;
      }));
  }

  logOut() {
    this.usuario = null;
    this.token = '';
    this.menu = [];

    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('menu');

    this.router.navigate(['/login']);
  }

}
