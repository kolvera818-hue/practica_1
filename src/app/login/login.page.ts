
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

import {
  IonContent,
  IonButton,
  IonIcon,
  IonCheckbox,
  IonItem,
  IonInput
} from '@ionic/angular';

import { addIcons } from 'ionicons';
import {
  lockClosedOutline,
  mailOutline,
  eyeOutline,
  eyeOffOutline
} from 'ionicons/icons';

interface RespuestaLogin {
  status: string;
  message: string;
  usuario?: {
    id: number;
    nombre: string;
    username: string;
    correo: string;
  };
}

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    IonContent,
    IonButton,
    IonIcon,
    IonCheckbox,
    IonItem,
    IonInput
  ]
})
export class LoginPage {

  usuario = '';
  password = '';

  mostrarPassword = false;
  recordar = false;
  cargando = false;

  errorUsuario = '';
  errorPassword = '';
  mensaje = '';

  private apiUrl =
    'http://DESKTOP-V83PK5A/api_ionic/login_usuario.php';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    addIcons({
      lockClosedOutline,
      mailOutline,
      eyeOutline,
      eyeOffOutline
    });
  }

  ionViewWillEnter() {
    const sesion =
      localStorage.getItem('usuario') ||
      sessionStorage.getItem('usuario');

    if (sesion) {
      try {
        const datos = JSON.parse(sesion);

        if (datos && datos.id) {
          this.router.navigate(['/home'], {
            replaceUrl: true
          });
        }
      } catch {
        localStorage.removeItem('usuario');
        sessionStorage.removeItem('usuario');
      }
    }
  }

  mostrarOcultarPassword() {
    this.mostrarPassword = !this.mostrarPassword;
  }

  iniciarSesion() {

    this.errorUsuario = '';
    this.errorPassword = '';
    this.mensaje = '';

    const identificador = this.usuario.trim();

    if (!identificador) {
      this.errorUsuario =
        'Ingresa tu correo o nombre de usuario';
    }

    if (!this.password) {
      this.errorPassword =
        'Ingresa tu contraseña';
    }

    if (this.errorUsuario || this.errorPassword) {
      return;
    }

    if (
      identificador.includes('@') &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identificador)
    ) {
      this.errorUsuario =
        'Ingresa un correo electrónico válido';
      return;
    }

    if (this.cargando) {
      return;
    }

    this.cargando = true;

    this.http.post<RespuestaLogin>(
      this.apiUrl,
      {
        usuario: identificador,
        password: this.password
      }
    ).subscribe({

      next: (respuesta: RespuestaLogin) => {

        this.cargando = false;

        if (
          respuesta.status === 'success' &&
          respuesta.usuario
        ) {

          const datos = JSON.stringify(
            respuesta.usuario
          );

          localStorage.removeItem('usuario');
          sessionStorage.removeItem('usuario');

          if (this.recordar) {
            localStorage.setItem('usuario', datos);
          } else {
            sessionStorage.setItem('usuario', datos);
          }

          this.password = '';

          this.router.navigate(['/home'], {
            replaceUrl: true
          });

        } else {
          this.mensaje =
            respuesta.message ||
            'Correo electrónico o contraseña incorrectos';
        }
      },

      error: (error: any) => {

        this.cargando = false;

        if (error.status === 401) {
          this.mensaje =
            'Correo electrónico o contraseña incorrectos';
        } else {
          this.mensaje =
            error.error?.message ||
            'Ocurrió un error de conexión. Inténtalo nuevamente';
        }

        console.error('Error de login:', error);
      }

    });
  }

  irRegistro() {
    this.router.navigate(['/registro-usuarios']);
  }

  crearCuenta() {
    this.irRegistro();
  }

  recuperarPassword() {
    this.mensaje =
      'La recuperación de contraseña todavía no está configurada.';
  }

}
