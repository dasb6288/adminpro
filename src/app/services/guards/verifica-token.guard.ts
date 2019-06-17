import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UsuarioService } from '../usuario/usuario.service';
import { resolve, reject } from 'q';

@Injectable({
  providedIn: 'root'
})
export class VerificaTokenGuard implements CanActivate {

  constructor(public usuarioService: UsuarioService) { }

  canActivate(): Promise<boolean> | boolean {
    console.log('VerificaToken Guard');
    const token = this.usuarioService.token;
    const payload = JSON.parse(atob(token.split('.')[1]));
    // console.log(payload);
    const expirado = this.expirado(payload.exp);
    if (expirado) {
      this.usuarioService.logOut();
      return false;
    }

    return this.verificaRenueva(payload.exp);
  }

  expirado(fechaExp: number) {
    const ahora = new Date().getTime() / 1000;
    return (fechaExp < ahora) ? true : false;
  }

  verificaRenueva(fechaExp: number): Promise<boolean> {
    return new Promise((res, rej) => {
      const tokenExp = new Date(fechaExp * 1000);
      const ahora = new Date();

      ahora.setTime(ahora.getTime() + (4 * 60 * 60 * 1000));

      if (tokenExp.getTime() > ahora.getTime()) {
        res(true);
      } else {
        this.usuarioService.renuevaToken()
          .subscribe(() => {
            res(true);
          }, () => {
            this.usuarioService.logOut();
            rej(false);
          });
      }
    });
  }

}
