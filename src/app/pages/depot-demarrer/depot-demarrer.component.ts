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

  chargementCode = signal(false);
  chargementValidation = signal(false);
  depotValide = signal(false);

  constructor(
    private apiDepot: ApiDepotService,
    private cdr: ChangeDetectorRef,
  ) {}

  demarrer() {
    this.message.set('');
    this.fichiers = [];
    this.depotValide.set(false);

    if (!this.code) {
      this.message.set('Entre le code du jour.');
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

  surChoixFichiers(event: Event) {
    const input = event.target as HTMLInputElement;
    this.fichiers = input.files ? Array.from(input.files) : [];
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
