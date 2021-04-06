import { UsuarioService } from 'src/app/services/usuario.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(
    private usuarioService: UsuarioService,
    private router: Router) { }

  logedUser = false;

  ngOnInit(): void {
    this.userLoged();
  }

  userLoged(): void {
    this.logedUser = this.usuarioService.usuarioLogado();
  }

  logOut(): void {
    this.logedUser = false;
    window.localStorage.removeItem('token');
    this.router.navigate(['login']);
  }

}
