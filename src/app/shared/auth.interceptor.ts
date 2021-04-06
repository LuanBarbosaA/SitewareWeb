import { Observable } from 'rxjs/internal/Observable';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UsuarioService } from '../services/usuario.service';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private usuario: UsuarioService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authToken = this.usuario.obterToken();
    let authReq: HttpRequest<any> = req;

    if (authToken && !this.usuario.tokenEstaExpirado(authToken)) {
        authReq = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${authToken}`)
          });
    }

    return next.handle(authReq)
        .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // Erro de client-side ou de rede
      console.error('Ocorreu um erro:', error.error.message);
    } else {
      // Erro retornando pelo backend
      console.error(
        `Código do erro ${error.status}, ` +
        `Erro: ${JSON.stringify(error.error)}`);
    }
    // retornar um observable com uma mensagem amigavel.
    return throwError('Ocorreu um erro, tente novamente');
  }
}
