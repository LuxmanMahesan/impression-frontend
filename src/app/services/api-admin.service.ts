import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ReponseCodeCourant {
  code: string;
}

export interface ReponseFichierAdmin {
  idFichier: string;
  nom: string;
  typeMime: string;
  taille: number;
}

export interface ReponseDepotAdmin {
  idDepot: string;
  statut: string;
  fichiers: ReponseFichierAdmin[];
}

@Injectable({ providedIn: 'root' })
export class ApiAdminService {
  constructor(private http: HttpClient) {}

  codeCourant(): Observable<ReponseCodeCourant> {
    return this.http.get<ReponseCodeCourant>('/api/admin/code-courant');
  }

  depot(idDepot: string): Observable<ReponseDepotAdmin> {
    return this.http.get<ReponseDepotAdmin>(`/api/admin/depots/${idDepot}`);
  }

  telechargerFichier(idDepot: string, idFichier: string): Observable<Blob> {
    return this.http.get(
      `/api/admin/depots/${idDepot}/fichiers/${idFichier}/telechargement`,
      { responseType: 'blob' }
    );
  }
}
