import { LoginDTO } from './../DTO/LoginDTO';
import { UsuarioDTO } from './../DTO/UsuarioDTO';
import { Observable } from 'rxjs/internal/Observable';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { formatDate } from '@angular/common';
import jwt_decode from 'jwt-decode';
import { map, tap } from 'rxjs/operators';
import { STRING_TYPE } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http: HttpClient) { }

  // userLoged = false;

  login(login: LoginDTO): Observable<any> {
    // return this.http.post('http://localhost:52738/login/signin', login, {observe: 'response'})
    //   .pipe(tap(data => {
    //     if (data.status === 200) {
    //       this.userLoged = true;
    //     }
    //   }));
    return this.http.post('http://localhost:52738/api/usuario/login', login);
  }

  obterDetalheUsuario(id: number): Observable<UsuarioDTO> {
    return this.http.post<UsuarioDTO>('http://localhost:52738/api/usuario', parseInt(id.toString(), 2));
  }

  cadastrarUsuario(form): Observable<any> {
    // const head = new HttpHeaders().set('X-Requested-With', 'XMLHttpRequest').set('Content-Type', 'application/json');
    const usuario = new UsuarioDTO();
    usuario.Cpf = form.cpf;
    usuario.DataNascimento = form.nascimento;
    usuario.Endereco = form.Endereco;
    usuario.Email = form.email;
    usuario.Senha = form.senha;

    return this.http.post<UsuarioDTO>('http://localhost:52738/api/usuario', usuario);
  }

  obterToken(): string {
    const token = window.localStorage.getItem('token');
    return token;
  }

  getUserId(token: string): number {
    const decoded: any = jwt_decode(token);

    if (decoded.exp === undefined) {
      return null;
    }
    return decoded.userid;
  }

  obterDataExpiracaoToken(token: string): Date {
    const decoded: any = jwt_decode(token);

    if (decoded.exp === undefined) {
      return null;
    }

    const date = new Date(0);
    date.setUTCSeconds(decoded.exp);
    return date;
  }

  tokenEstaExpirado(token?: string): boolean {
    if (!token) {
      return true;
    }

    const date = this.obterDataExpiracaoToken(token);
    if (date === undefined) {
      return false;
    }

    return !(date.valueOf() > new Date().valueOf());
  }

  usuarioLogado(): boolean {
    const token = this.obterToken();
    // if (!token || !this.userLoged) {
    if (!token) {
      return false;
    } else if (this.tokenEstaExpirado(token)) {
      return false;
    }

    return true;
  }

}
