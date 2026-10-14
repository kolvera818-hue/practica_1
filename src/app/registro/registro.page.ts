
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  HttpClient,
  HttpClientModule
} from '@angular/common/http';

import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  IonList,
  IonItem,
  IonInput
} from '@ionic/angular';

import { API } from '../config/api.config';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButton,
    IonList,
    IonItem,
    IonInput
  ]
})
export class RegistroPage {

  usuario = {
    nombre: '',
    matricula: '',
    correo: ''
  };

  constructor(
    private http: HttpClient
  ) {}

  guardarDatos() {

    if (
      this.usuario.nombre.trim() === '' ||
      this.usuario.matricula.trim() === '' ||
      this.usuario.correo.trim() === ''
    ) {

      alert(
        'Faltan datos, completa todos los campos'
      );

      return;
    }

    this.http.post<any>(
      API.guardarAlumno,
      this.usuario
    ).subscribe({

      next: (respuesta) => {

        console.log(
          'Respuesta:',
          respuesta
        );

        if (
          respuesta.status === 'success'
        ) {

          alert(
            respuesta.message ||
            'Datos guardados correctamente'
          );

          this.usuario = {
            nombre: '',
            matricula: '',
            correo: ''
          };

        } else {

          alert(
            respuesta.message ||
            'No se pudieron guardar los datos'
          );
        }
      },

      error: (error) => {

        console.error(
          'Error:',
          error
        );

        if (
          error.error?.message
        ) {

          alert(
            error.error.message
          );

        } else {

          alert(
            'Error al conectar con el servidor'
          );
        }
      }

    });
  }
}
