import { Routes } from '@angular/router';

export const routes: Routes = [

  {
    path: 'home',
    loadComponent: () =>
      import('./home/home.page')
        .then((m) => m.HomePage),
  },

  {
    path: 'detalles',
    loadComponent: () =>
      import('./detalles/detalles.page')
        .then((m) => m.DetallesPage),
  },

  {
    path: 'registro',
    loadComponent: () =>
      import('./registro/registro.page')
        .then((m) => m.RegistroPage),
  },

  {
    path: 'gestion-alumnos',
    loadComponent: () =>
      import('./gestion-alumnos/gestion-alumnos.page')
        .then((m) => m.GestionAlumnosPage),
  },

  {
    path: 'gestion-carreras',
    loadComponent: () =>
      import('./gestion-carreras/gestion-carreras.page')
        .then((m) => m.GestionCarrerasPage),
  },

  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  }

];