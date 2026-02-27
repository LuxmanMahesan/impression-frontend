import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiAdminService } from '../../services/api-admin.service';

@Component({
  selector: 'app-admin-connexion',
  standalone: true,
  templateUrl: './admin-connexion.component.html',
  styleUrl: './admin-connexion.component.scss',
  imports: [FormsModule],
})
export class AdminConnexionComponent {
  identifiant = 'admin';
  motDePasse = 'admin123';
  message = '';

  constructor(private routeur: Router, private apiAdmin: ApiAdminService) {}

  connecter() {
    this.message = '';

    if (!this.identifiant || !this.motDePasse) {
      this.message = 'Identifiant et mot de passe requis.';
      return;
    }

    const base64 = btoa(`${this.identifiant}:${this.motDePasse}`);
    localStorage.setItem('authAdmin', `Basic ${base64}`);

    // On vérifie immédiatement en appelant un endpoint admin
    this.apiAdmin.codeCourant().subscribe({
      next: () => this.routeur.navigateByUrl('/admin/tableau'),
      error: () => {
        localStorage.removeItem('authAdmin');
        this.message = 'Identifiants invalides (401).';
      },
    });
  }
}
