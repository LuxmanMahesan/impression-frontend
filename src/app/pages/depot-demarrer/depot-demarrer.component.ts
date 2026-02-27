import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiDepotService } from '../../services/api-depot.service';

@Component({
  selector: 'app-depot-demarrer',
  standalone: true,
  templateUrl: './depot-demarrer.component.html',
  styleUrl: './depot-demarrer.component.scss',
  imports: [CommonModule, FormsModule],
})
export class DepotDemarrerComponent {
  code = '';
  idDepot = '';
  message = '';
  fichiers: File[] = [];

  constructor(private apiDepot: ApiDepotService) {}

  demarrer() {
    this.message = '';
    this.idDepot = '';
    this.fichiers = [];

    if (!this.code) {
      this.message = 'Entre le code du jour.';
      return;
    }

    this.apiDepot.demarrerDepot(this.code).subscribe({
      next: (r) => {
        this.idDepot = r.idDepot;
        this.message = 'Dépôt démarré ✅';
      },
      error: () => (this.message = 'Code invalide ❌'),
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

    this.apiDepot.televerserFichiers(this.idDepot, this.fichiers).subscribe({
      next: () => (this.message = 'Upload terminé ✅'),
      error: () => (this.message = 'Erreur upload ❌'),
    });
  }

  valider() {
    this.message = '';

    if (!this.idDepot) return;

    this.apiDepot.validerDepot(this.idDepot).subscribe({
      next: () => (this.message = 'Dépôt validé ✅ Donne cet ID au magasin.'),
      error: () => (this.message = 'Erreur validation ❌'),
    });
  }
}
