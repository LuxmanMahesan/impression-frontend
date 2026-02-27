import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiDepotService } from '../../services/api-depot.service';

@Component({
  selector: 'app-depot-demarrer',
  standalone: true,
  templateUrl: './depot-demarrer.component.html',
  styleUrl: './depot-demarrer.component.scss',
  imports: [FormsModule],
})
export class DepotDemarrerComponent {
  code = '';
  idDepot = '';
  message = '';
  fichiers: File[] = [];

  chargementCode = false;
  chargementUpload = false;
  chargementValidation = false;
  depotValide = false;

  constructor(private apiDepot: ApiDepotService) {}

  demarrer() {
    this.message = '';
    this.fichiers = [];
    this.depotValide = false;

    if (!this.code) {
      this.message = 'Entre le code du jour.';
      return;
    }

    this.chargementCode = true;

    this.apiDepot.demarrerDepot(this.code.trim()).subscribe({
      next: (r) => {
        this.idDepot = r.idDepot;
        this.message = 'Dépôt démarré ✅';
        this.chargementCode = false;
      },
      error: (err) => {
        console.error('Erreur demarrer:', err);
        this.message = 'Code invalide ou erreur serveur ❌';
        this.chargementCode = false;
        // L'utilisateur peut corriger le code et réessayer
      },
    });
  }

  surChoixFichiers(event: Event) {
    const input = event.target as HTMLInputElement;
    this.fichiers = input.files ? Array.from(input.files) : [];
  }

  envoyerFichiers() {
    this.message = '';

    if (!this.idDepot) {
      this.message = 'Démarre le dépôt avant.';
      return;
    }
    if (!this.fichiers.length) {
      this.message = 'Choisis au moins un fichier.';
      return;
    }

    this.chargementUpload = true;

    this.apiDepot.televerserFichiers(this.idDepot, this.fichiers).subscribe({
      next: () => {
        this.message = 'Upload terminé ✅';
        this.chargementUpload = false;
      },
      error: (err) => {
        console.error('Erreur upload:', err);
        this.message = 'Erreur upload ❌';
        this.chargementUpload = false;
      },
    });
  }

  valider() {
    this.message = '';

    if (!this.idDepot || this.depotValide) return;

    this.chargementValidation = true;

    this.apiDepot.validerDepot(this.idDepot).subscribe({
      next: () => {
        this.depotValide = true;
        this.chargementValidation = false;
        this.message = 'Dépôt validé ✅ Communiquez cet identifiant au magasin.';
      },
      error: (err) => {
        console.error('Erreur validation:', err);
        this.chargementValidation = false;
        this.message = 'Erreur validation ❌';
      },
    });
  }
}
