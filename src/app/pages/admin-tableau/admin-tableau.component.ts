import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiAdminService, ReponseDepotAdmin } from '../../services/api-admin.service';

@Component({
  selector: 'app-admin-tableau',
  standalone: true,
  templateUrl: './admin-tableau.component.html',
  styleUrl: './admin-tableau.component.scss',
  imports: [FormsModule],
})
export class AdminTableauComponent implements OnInit {
  codeDuJour = signal('…');
  idDepot = '';
  message = signal('');
  depotCharge = signal<ReponseDepotAdmin | null>(null);

  constructor(private api: ApiAdminService, private routeur: Router) {}

  ngOnInit(): void {
    const auth = localStorage.getItem('authAdmin');
    if (!auth) {
      this.routeur.navigateByUrl('/admin/connexion');
      return;
    }

    this.api.codeCourant().subscribe({
      next: (r) => this.codeDuJour.set(r.code),
      error: () => {
        localStorage.removeItem('authAdmin');
        this.routeur.navigateByUrl('/admin/connexion');
      },
    });
  }

  deconnexion() {
    localStorage.removeItem('authAdmin');
    this.routeur.navigateByUrl('/admin/connexion');
  }

  chargerDepot() {
    this.message.set('');
    this.depotCharge.set(null);

    if (!this.idDepot) {
      this.message.set('Entre un ID de dépôt.');
      return;
    }

    this.api.depot(this.idDepot).subscribe({
      next: (d) => {
        this.depotCharge.set(d);
        this.message.set('Dépôt chargé ✅');
      },
      error: () => this.message.set('Dépôt introuvable / erreur serveur ❌'),
    });
  }

  telechargerFichier(idFichier: string, nomOriginal: string) {
    this.message.set('');
    if (!this.idDepot) return;

    this.api.telechargerFichier(this.idDepot, idFichier).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = nomOriginal || `fichier-${idFichier}`;
        a.click();
        window.URL.revokeObjectURL(url);
        this.message.set('Téléchargement lancé ✅');
      },
      error: () => this.message.set('Erreur téléchargement ❌'),
    });
  }
}
