import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const gardeAdmin: CanActivateFn = () => {
  const routeur = inject(Router);
  const jeton = localStorage.getItem('authAdmin'); // base64(login:mdp)
  if (jeton) return true;

  routeur.navigate(['/admin/connexion']);
  return false;
};
