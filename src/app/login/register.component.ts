import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { UsuarioService } from '../services/usuario/usuario.service';
import { Usuario } from '../pages/models/usuario.model';
import { Router } from '@angular/router';

declare function init_plugins();

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./login.component.css']
})
export class RegisterComponent implements OnInit {

  frm: FormGroup;

  constructor(
    public usuarioService: UsuarioService,
    public router: Router
  ) { }

  ngOnInit() {
    init_plugins();

    this.frm = new FormGroup({
      nombre: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, Validators.required),
      password2: new FormControl(null, Validators.required),
      condiciones: new FormControl(false)
    }, { validators: this.sonIguales('password', 'password2') });
  }

  registrarUsuario() {
    if (this.frm.invalid) {
      return;
    }
    if (!this.frm.value.condiciones) {
      Swal.fire({
        type: 'warning',
        title: 'Importante',
        text: 'Debe aceptar las condiciones'
      });
      return;
    }

    const usuario = new Usuario(this.frm.value.nombre, this.frm.value.email, this.frm.value.password);
    this.usuarioService.crearUsuario(usuario)
      .subscribe(res => this.router.navigate(['/login']));
  }

  sonIguales(campo1: string, campo2: string) {
    return (group: FormGroup) => {
      const pass1 = group.controls[campo1].value;
      const pass2 = group.controls[campo2].value;
      if (pass1 === pass2) {
        return null;
      }
      return {
        sonIguales: true
      };
    };
  }

}
