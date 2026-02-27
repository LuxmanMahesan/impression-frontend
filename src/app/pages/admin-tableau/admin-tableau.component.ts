import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiAdminService, ReponseDepotAdmin } from '../../services/api-admin.service';

@Component({
  selector: 'app-admin-tableau',
  standalone: true,
  templateUrl: './admin-tableau.component.html',
  styleUrl: './admin-tableau.component.scss',
  imports: [CommonModule, FormsModule],
})
export class AdminTableauComponent {
  codeDuJour = '';
  idDepot = '';
  message = '';
  depotCharge: ReponseDepotAdmin | null = null;

  constructor(private api: ApiAdminService) {}

  ngOnInit() {
    const auth = localStorage.getItem('authAdmin');
    if (!auth) {
      location.href = '/admin/connexion';
      return;
    }

    this.api.codeCourant().subscribe({
      next: (r) => (this.codeDuJour = r.code),
      error: () => {
        localStorage.removeItem('authAdmin');
        location.href = '/admin/connexion';
      },
    });
  }

  deconnexion() {
    localStorage.removeItem('authAdmin');
    location.href = '/admin/connexion';
  }

  chargerDepot() {
    this.message = '';
    this.depotCharge = null;

    if (!this.idDepot) {
      this.message = 'Entre un ID de dépôt.';
      return;
    }

    this.api.depot(this.idDepot).subscribe({
      next: (d) => {
        this.depotCharge = d;
        this.message = 'Dépôt chargé ✅';
      },
      error: () => (this.message = 'Dépôt introuvable / erreur serveur ❌'),
    });
  }

  telechargerFichier(idFichier: string, nomOriginal: string) {
    this.message = '';
    if (!this.idDepot) return;

    this.api.telechargerFichier(this.idDepot, idFichier).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = nomOriginal || `fichier-${idFichier}`;
        a.click();
        window.URL.revokeObjectURL(url);
        this.message = 'Téléchargement lancé ✅';
      },
      error: () => (this.message = 'Erreur téléchargement ❌'),
    });
  }
}
