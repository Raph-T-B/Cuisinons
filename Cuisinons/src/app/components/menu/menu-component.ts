import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthentificationService } from '../../services/authentification-service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-menu-component',
  imports: [RouterLink,AsyncPipe],
  templateUrl: './menu-component.html',
  styleUrl: './menu-component.css',
})
export class MenuComponent {
  constructor (public authServ : AuthentificationService){}
  onLogout(): void {
    this.authServ.logout();
  }
}
