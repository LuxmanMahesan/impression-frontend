import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ReponseCodeCourant {
  code: string;
}

export interface ReponseDepotResume {
  codePublic: string;
  statut: string;
  creeLe: string;
  valideLe: string | null;
  nbFichiers: number;
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

  listerDepots(): Observable<ReponseDepotResume[]> {
    return this.http.get<ReponseDepotResume[]>('/api/admin/depots');
  }

  depot(codePublic: string): Observable<ReponseDepotAdmin> {
    return this.http.get<ReponseDepotAdmin>(`/api/admin/depots/${codePublic}`);
  }

  supprimerDepot(codePublic: string): Observable<any> {
    return this.http.delete(`/api/admin/depots/${codePublic}`);
  }

  telechargerFichier(codePublic: string, idFichier: string): Observable<Blob> {
    return this.http.get(
      `/api/admin/depots/${codePublic}/fichiers/${idFichier}/telechargement`,
      { responseType: 'blob' }
    );
  }
}
