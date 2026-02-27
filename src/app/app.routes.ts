import { Routes } from '@angular/router';

import { AdminConnexionComponent } from './pages/admin-connexion/admin-connexion.component';
import { AdminTableauComponent } from './pages/admin-tableau/admin-tableau.component';
import { DepotDemarrerComponent } from './pages/depot-demarrer/depot-demarrer.component';
import {DepotFichierComponent} from './pages/depot-fichiers/depot-fichiers.component';

export const routes: Routes = [
  // page par défaut : on envoie vers le dépôt client
  { path: '', pathMatch: 'full', redirectTo: 'depot' },

  // côté client
  { path: 'depot', component: DepotDemarrerComponent },
  { path: 'depot/:idDepot/fichiers', component: DepotFichierComponent },

  // côté admin
  { path: 'admin/connexion', component: AdminConnexionComponent },
  { path: 'admin/tableau', component: AdminTableauComponent },

  // fallback
  { path: '**', redirectTo: 'depot' },
];
