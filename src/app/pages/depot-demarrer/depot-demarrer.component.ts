import { Component, signal, ChangeDetectorRef } from '@angular/core';
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
  idDepot = signal('');
  message = signal('');
  fichiers: File[] = [];

  readonly MAX_FICHIERS = 10;

  chargementCode = signal(false);
  chargementValidation = signal(false);
  depotValide = signal(false);

  constructor(
    private apiDepot: ApiDepotService,
    private cdr: ChangeDetectorRef,
  ) {}

  /** Filtre le code pour n'accepter que des chiffres, max 4 caractères */
  surSaisieCode(event: Event) {
    const input = event.target as HTMLInputElement;
    // Ne garder que les chiffres, tronquer à 4
    this.code = input.value.replace(/\D/g, '').slice(0, 4);
    input.value = this.code;
  }

  demarrer() {
    this.message.set('');
    this.fichiers = [];
    this.depotValide.set(false);

    if (!this.code || this.code.length !== 4) {
      this.message.set('Entrez un code à 4 chiffres.');
      return;
    }

    this.chargementCode.set(true);

    this.apiDepot.demarrerDepot(this.code.trim()).subscribe({
      next: (r: any) => {
        const id = r.idDepot || r.id || '';
        this.idDepot.set(id);
        this.chargementCode.set(false);
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Erreur demarrer:', err);
        this.message.set('Code invalide ou erreur serveur ❌');
        this.chargementCode.set(false);
        this.cdr.detectChanges();
      },
    });
  }

  /**
   * Accumule les fichiers sélectionnés au lieu de les écraser.
   * Plafonne à MAX_FICHIERS (10).
   */
  surChoixFichiers(event: Event) {
    const input = event.target as HTMLInputElement;
    const nouveaux = input.files ? Array.from(input.files) : [];

    if (!nouveaux.length) return;

    const placesRestantes = this.MAX_FICHIERS - this.fichiers.length;

    if (placesRestantes <= 0) {
      this.message.set(`Maximum ${this.MAX_FICHIERS} fichiers atteint.`);
      input.value = '';
      return;
    }

    // Filtrer les doublons (même nom + même taille)
    const aAjouter = nouveaux.filter(
      (n) => !this.fichiers.some((f) => f.name === n.name && f.size === n.size)
    );

    if (aAjouter.length > placesRestantes) {
      this.fichiers = [...this.fichiers, ...aAjouter.slice(0, placesRestantes)];
      this.message.set(
        `Limite de ${this.MAX_FICHIERS} fichiers atteinte. Certains fichiers n'ont pas été ajoutés.`
      );
    } else {
      this.fichiers = [...this.fichiers, ...aAjouter];
      this.message.set('');
    }

    // Reset l'input pour pouvoir resélectionner les mêmes fichiers si besoin
    input.value = '';
  }

  /** Retire un fichier de la liste par son index */
  retirerFichier(index: number) {
    this.fichiers = this.fichiers.filter((_, i) => i !== index);
    this.message.set('');
  }

  valider() {
    this.message.set('');

    if (!this.idDepot() || this.depotValide()) return;

    this.chargementValidation.set(true);

    const doValider = () => {
      this.apiDepot.validerDepot(this.idDepot()).subscribe({
        next: () => {
          this.depotValide.set(true);
          this.chargementValidation.set(false);
          this.message.set('Dépôt validé ✅ Communiquez cet identifiant au magasin.');
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          console.error('Erreur validation:', err);
          this.chargementValidation.set(false);
          this.message.set('Erreur validation ❌');
          this.cdr.detectChanges();
        },
      });
    };

    if (this.fichiers.length > 0) {
      this.apiDepot.televerserFichiers(this.idDepot(), this.fichiers).subscribe({
        next: () => doValider(),
        error: (err: any) => {
          console.error('Erreur upload:', err);
          this.chargementValidation.set(false);
          this.message.set('Erreur upload des fichiers ❌');
          this.cdr.detectChanges();
        },
      });
    } else {
      doValider();
    }
  }
}
