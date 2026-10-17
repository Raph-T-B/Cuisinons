import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthentificationService } from '../../services/authentification-service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login-component.html'
})
export class LoginComponent {
  login = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthentificationService) {}

  onSubmit(): void {
    const check = this.authService.validateCredentials(this.login, this.password);
    if (!check.valid) {
      this.errorMessage = check.error || 'Identifiants invalides';
      return;
    }
    this.authService.login(this.login);
  }
}
