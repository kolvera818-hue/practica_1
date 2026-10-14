
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
  IonIcon
} from '@ionic/angular';

import { API } from '../config/api.config';

import { addIcons } from 'ionicons';
import {
  personOutline,
  mailOutline,
  lockClosedOutline,
  eyeOutline,
  eyeOffOutline,
  arrowBackOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-registro-usuarios',
  templateUrl: './registro-usuarios.page.html',
  styleUrls: ['./registro-usuarios.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    IonContent,
    IonButton,
    IonInput,
    IonItem,
    IonIcon
  ]
})
export class RegistroUsuariosPage {

  usuario = {
    nombre: '',
    username: '',
    correo: '',
    password: '',
    confirmarPassword: ''
  };

  mostrarPassword = false;
  mostrarConfirmacion = false;
  cargando = false;

  error = '';
  exito = '';

  private apiUrl = API.registrarUsuario;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    addIcons({
      personOutline,
      mailOutline,
      lockClosedOutline,
      eyeOutline,
      eyeOffOutline,
      arrowBackOutline
    });
  }

  registrar() {

    if (this.cargando) return;

    this.error = '';
    this.exito = '';

    this.usuario.nombre = this.usuario.nombre.trim();
    this.usuario.username = this.usuario.username.trim();
    this.usuario.correo = this.usuario.correo.trim().toLowerCase();

    if (
      !this.usuario.nombre ||
      !this.usuario.username ||
      !this.usuario.correo ||
      !this.usuario.password ||
      !this.usuario.confirmarPassword
    ) {
      this.error = 'Por favor, completa todos los campos';
      return;
    }

    const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!correoValido.test(this.usuario.correo)) {
      this.error = 'Ingresa un correo electrónico válido';
      return;
    }

    if (this.usuario.password.length < 8) {
      this.error =
        'La contraseña debe contener al menos 8 caracteres';
      return;
    }

    if (
      this.usuario.password !==
      this.usuario.confirmarPassword
    ) {
      this.error = 'Las contraseñas no coinciden';
      return;
    }

    this.cargando = true;

    this.http.post<any>(
      this.apiUrl,
      this.usuario
    ).subscribe({

      next: (respuesta: any) => {
        this.cargando = false;

        if (respuesta.status === 'success') {

          this.exito = 'Cuenta creada correctamente';

          this.usuario = {
            nombre: '',
            username: '',
            correo: '',
            password: '',
            confirmarPassword: ''
          };

          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1500);

        } else {
          this.error =
            respuesta.message ||
            'No se pudo crear la cuenta';
        }
      },

      error: (err: any) => {
        this.cargando = false;

        console.error('Error del registro:', err);

        this.error =
          err.error?.message ||
          'Ocurrió un error de conexión. Inténtalo nuevamente';
      }
    });
  }

  volverLogin() {
    this.router.navigate(['/login']);
  }
}
