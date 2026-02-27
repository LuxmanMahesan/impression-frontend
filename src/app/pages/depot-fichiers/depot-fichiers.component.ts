import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiDepotService } from '../../services/api-depot.service';

@Component({
  selector: 'app-depot-fichier',
  standalone: true,
  templateUrl: './depot-fichiers.component.html',
  styleUrl: './depot-fichiers.component.scss',
  imports: [],
})
export class DepotFichierComponent implements OnInit {
  idDepot = '';
  fichiers: File[] = [];
  message = '';
  enCours = false;
  depotValide = false;

  constructor(
    private route: ActivatedRoute,
    private routeur: Router,
    private apiDepot: ApiDepotService
  ) {}

  ngOnInit(): void {
    const param = this.route.snapshot.paramMap.get('idDepot');
    this.idDepot = param ? param : '';
    if (!this.idDepot) {
      this.message = "ID dépôt manquant dans l'URL.";
    }
  }

  surChoixFichiers(event: Event) {
    const input = event.target as HTMLInputElement;
    this.fichiers = input.files ? Array.from(input.files) : [];
  }

  uploader() {
    this.message = '';

    if (!this.idDepot) {
      this.message = 'ID dépôt invalide.';
      return;
    }
    if (!this.fichiers.length) {
      this.message = 'Choisis au moins un fichier.';
      return;
    }

    this.enCours = true;

    this.apiDepot.televerserFichiers(this.idDepot, this.fichiers).subscribe({
      next: () => {
        this.enCours = false;
        this.message = 'Upload terminé ✅';
      },
      error: () => {
        this.enCours = false;
        this.message = 'Erreur upload ❌';
      },
    });
  }

  valider() {
    this.message = '';

    if (!this.idDepot || this.depotValide) return;

    this.enCours = true;

    this.apiDepot.validerDepot(this.idDepot).subscribe({
      next: () => {
        this.enCours = false;
        this.depotValide = true;
        this.message = 'Dépôt validé ✅ Communiquez cet ID au magasin.';
      },
      error: () => {
        this.enCours = false;
        this.message = 'Erreur validation ❌';
      },
    });
  }

  retour() {
    this.routeur.navigateByUrl('/depot');
  }
}
