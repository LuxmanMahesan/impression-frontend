import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ReponseDepotDemarre {
  idDepot: string;
}

export interface ReponseAjoutFichiers {
  idsFichiers: string[];
}

export interface ReponseDepotValide {
  idDepot: string;
}

@Injectable({ providedIn: 'root' })
export class ApiDepotService {
  constructor(private http: HttpClient) {}

  demarrerDepot(code: string): Observable<ReponseDepotDemarre> {
    return this.http.post<ReponseDepotDemarre>('/api/depots/demarrer', { code });
  }

  televerserFichiers(idDepot: string, fichiers: File[]): Observable<ReponseAjoutFichiers> {
    const donnees = new FormData();
    for (const fichier of fichiers) {
      donnees.append('fichiers', fichier, fichier.name);
    }
    return this.http.post<ReponseAjoutFichiers>(`/api/depots/${idDepot}/fichiers`, donnees);
  }

  validerDepot(idDepot: string): Observable<ReponseDepotValide> {
    return this.http.post<ReponseDepotValide>(`/api/depots/${idDepot}/valider`, {});
  }
}
