import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

export interface UserProfile {
  username: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {
  private readonly STORAGE_KEY = 'auth_user';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();

  constructor(private router: Router) {}

  private hasToken(): boolean {
    return !!localStorage.getItem(this.STORAGE_KEY);
  }

  getCurrentUser(): UserProfile | null {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as UserProfile;
    } catch {
      return null;
    }
  }

  validateCredentials(login: string, pass: string): { valid: boolean; error?: string } {
    if (!login || !pass) {
      return { valid: false, error: 'Veuillez renseigner un identifiant et un mot de passe.' };
    }
    if (login !== pass) {
      return { valid: false, error: 'Le login et le mot de passe doivent être identiques.' };
    }
    if (login.length < 5) {
      return { valid: false, error: 'Au moins 5 caractères requis.' };
    }
    if (!/\d/.test(login)) {
      return { valid: false, error: 'Au moins un chiffre requis.' };
    }
    if (!/[./*+\-]/.test(login)) {
      return { valid: false, error: 'Au moins un caractère spécial requis parmi ./*-+' };
    }
    return { valid: true };
  }

  login(username: string): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify({ username }));
    this.isAuthenticatedSubject.next(true);
    this.router.navigate(['/accueil']);
  }

  logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/connexion']);
  }

  isLoggedIn(): boolean {
    return this.hasToken();
  }
}
