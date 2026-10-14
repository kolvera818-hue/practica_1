
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton
} from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButton
  ]
})
export class HomePage {

  nombreUsuario = '';

  constructor(private router: Router) {}

  ionViewWillEnter() {

    const datos = sessionStorage.getItem('usuario');

    if (!datos) {
      this.router.navigate(['/login'], {
        replaceUrl: true
      });
      return;
    }

    try {
      const usuario = JSON.parse(datos);
      this.nombreUsuario = usuario?.nombre || 'Usuario';
    } catch {
      sessionStorage.removeItem('usuario');
      this.router.navigate(['/login'], {
        replaceUrl: true
      });
    }
  }

  irDetalles() {
    this.router.navigate(['/detalles']);
  }

  irRegistro() {
    this.router.navigate(['/registro']);
  }

  irGestionAlumnos() {
    this.router.navigate(['/gestion-alumnos']);
  }

  irGestionCarreras() {
    this.router.navigate(['/gestion-carreras']);
  }

  cerrarSesion() {

    sessionStorage.removeItem('usuario');

    this.router.navigate(['/login'], {
      replaceUrl: true
    });

  }

}
