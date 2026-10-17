import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthentificationService } from '../../services/authentification-service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-menu-component',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, AsyncPipe],
  templateUrl: './menu-component.html',
  styleUrl: './menu-component.css',
})
export class MenuComponent {
  constructor(public authServ: AuthentificationService) {}

  get username(): string {
    return this.authServ.getCurrentUser()?.username || 'Utilisateur';
  }

  onLogout(): void {
    this.authServ.logout();
  }
}
