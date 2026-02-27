import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import {
  ApiAdminService,
  ReponseDepotResume,
  ReponseDepotAdmin,
} from '../../services/api-admin.service';

@Component({
  selector: 'app-admin-tableau',
  standalone: true,
  templateUrl: './admin-tableau.component.html',
  styleUrl: './admin-tableau.component.scss',
  imports: [FormsModule, DatePipe],
})
export class AdminTableauComponent implements OnInit {
  codeDuJour = signal('…');
  depots = signal<ReponseDepotResume[]>([]);
  depotDetail = signal<ReponseDepotAdmin | null>(null);
  message = signal('');
  chargement = signal(false);
  confirmationSuppression = signal('');

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

    this.chargerDepots();
  }

  deconnexion() {
    localStorage.removeItem('authAdmin');
    this.routeur.navigateByUrl('/admin/connexion');
  }

  chargerDepots() {
    this.chargement.set(true);
    this.api.listerDepots().subscribe({
      next: (liste) => {
        this.depots.set(liste);
        this.chargement.set(false);
      },
      error: () => {
        this.message.set('Erreur chargement des dépôts ❌');
        this.chargement.set(false);
      },
    });
  }

  voirDetail(codePublic: string) {
    this.depotDetail.set(null);
    this.message.set('');
    this.confirmationSuppression.set('');

    this.api.depot(codePublic).subscribe({
      next: (d) => this.depotDetail.set(d),
      error: () => this.message.set('Erreur chargement détail ❌'),
    });
  }

  fermerDetail() {
    this.depotDetail.set(null);
    this.confirmationSuppression.set('');
  }

  telechargerFichier(idFichier: string, nomOriginal: string) {
    const detail = this.depotDetail();
    if (!detail) return;

    this.api.telechargerFichier(detail.idDepot, idFichier).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = nomOriginal || `fichier-${idFichier}`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => this.message.set('Erreur téléchargement ❌'),
    });
  }

  demanderSuppression(codePublic: string) {
    this.confirmationSuppression.set(codePublic);
  }

  annulerSuppression() {
    this.confirmationSuppression.set('');
  }

  confirmerSuppression(codePublic: string) {
    this.api.supprimerDepot(codePublic).subscribe({
      next: () => {
        this.confirmationSuppression.set('');
        this.depotDetail.set(null);
        this.message.set('Dépôt ' + codePublic + ' supprimé ✅');
        this.chargerDepots();
      },
      error: () => this.message.set('Erreur suppression ❌'),
    });
  }
}
