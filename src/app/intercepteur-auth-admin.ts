import { HttpInterceptorFn } from '@angular/common/http';

export const intercepteurAuthAdmin: HttpInterceptorFn = (requete, suite) => {
  const jeton = localStorage.getItem('authAdmin');

  // On n’ajoute l’Authorization que pour les routes admin
  if (jeton && requete.url.startsWith('/api/admin')) {
    requete = requete.clone({
      setHeaders: { Authorization: `Basic ${jeton}` },
    });
  }

  return suite(requete);
};
