import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginDTO } from 'src/app/DTO/LoginDTO';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  login: LoginDTO = new LoginDTO();

  constructor(
    private usuarioService: UsuarioService,
    private router: Router) {
  }

  ngOnInit(): void {
  }

  submitLogin(): void {
    if (this.usuarioService.usuarioLogado()) {
      console.log('Usuario já está logado');
    } else {
      window.localStorage.removeItem('token');
      this.usuarioService.login(this.login).subscribe(res => {
        if (res) {
          window.localStorage.setItem('token', res.token);
          this.router.navigate(['']);
        } else {
          console.log('Usuário ou senha inválidos');
        }
      });
    }
  }

}
