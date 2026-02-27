import { HttpInterceptorFn } from '@angular/common/http';

export const intercepteurAuthAdmin: HttpInterceptorFn = (requete, suivant) => {
  const url = requete.url;

  const estEndpointAdmin =
    url.startsWith('/api/admin') ||
    (url.includes('://') && url.includes('/api/admin'));

  if (!estEndpointAdmin) {
    return suivant(requete);
  }

  const auth = localStorage.getItem('authAdmin'); // "Basic xxxxx"
  if (!auth) {
    return suivant(requete);
  }

  return suivant(
    requete.clone({
      setHeaders: { Authorization: auth },
    })
  );
};
