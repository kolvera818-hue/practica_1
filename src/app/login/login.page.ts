
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import {
  IonContent,
  IonButton,
  IonInput,
  IonItem,
  IonIcon,
  IonCheckbox
} from '@ionic/angular';

import { addIcons } from 'ionicons';
import {
  mailOutline,
  lockClosedOutline,
  eyeOutline,
  eyeOffOutline
} from 'ionicons/icons';

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
    IonInput,
    IonItem,
    IonIcon,
    IonCheckbox
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
    private router: Router,
    private http: HttpClient
  ) {
    addIcons({
      mailOutline,
      lockClosedOutline,
      eyeOutline,
      eyeOffOutline
    });
  }

  mostrarOcultarPassword() {
    this.mostrarPassword = !this.mostrarPassword;
  }

  iniciarSesion() {

    if (this.cargando) return;

    this.errorUsuario = '';
    this.errorPassword = '';
    this.mensaje = '';

    this.usuario = this.usuario.trim();

    if (!this.usuario) {
      this.errorUsuario = 'Ingresa tu correo o usuario';
    }

    if (!this.password) {
      this.errorPassword = 'Ingresa tu contraseña';
    }

    if (this.errorUsuario || this.errorPassword) {
      return;
    }

    if (this.usuario.includes('@')) {
      const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!correoValido.test(this.usuario)) {
        this.errorUsuario =
          'Ingresa un correo electrónico válido';
        return;
      }
    }

    this.cargando = true;

    this.http.post<any>(this.apiUrl, {
      usuario: this.usuario,
      password: this.password
    }).subscribe({

      next: (respuesta: any) => {
        this.cargando = false;

        if (respuesta.status === 'success') {

          this.mensaje = 'Inicio de sesión exitoso';

          // Temporal: se reemplazará por una sesión
          // validada por el servidor.
          sessionStorage.setItem(
            'usuario',
            JSON.stringify(respuesta.usuario)
          );

          this.router.navigate(['/home']);

        } else {
          this.mensaje =
            'Correo electrónico o contraseña incorrectos';
        }
      },

      error: (err: any) => {
        this.cargando = false;
        console.error('Error de login:', err);

        if (err.status === 401) {
          this.mensaje =
            'Correo electrónico o contraseña incorrectos';
        } else {
          this.mensaje =
            'Ocurrió un error de conexión. Inténtalo nuevamente';
        }
      }

    });
  }

  irRegistro() {
    this.router.navigate(['/registro-usuarios']);
  }

  recuperarPassword() {
    this.mensaje =
      'La recuperación de contraseña aún no está disponible';
  }
}
