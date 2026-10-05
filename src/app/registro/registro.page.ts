import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

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
export class RegistroPage implements OnInit {

  usuario = {
    nombre: '',
    matricula: '',
    correo: ''
  };

  constructor(private http: HttpClient) {}

  ngOnInit() {}

  guardarDatos() {

    // Validar campos vacíos
    if (
      this.usuario.nombre.trim() === '' ||
      this.usuario.matricula.trim() === '' ||
      this.usuario.correo.trim() === ''
    ) {
      alert('Faltan datos. Todos los campos son obligatorios');
      return;
    }

    console.log('Datos enviados:', this.usuario);

    this.http.post<any>(
      'http://localhost/api_ionic/guardar_alumno.php',
      this.usuario
    ).subscribe({

      next: (respuesta) => {

        console.log('Respuesta del servidor:', respuesta);

        if (respuesta.status === 'success') {

          alert(
            respuesta.message ||
            'Alumno guardado correctamente'
          );

          // Limpiar formulario después de guardar
          this.usuario = {
            nombre: '',
            matricula: '',
            correo: ''
          };

        } else {

          // Aquí muestra el motivo que mande PHP
          alert(
            respuesta.message ||
            'No se pudo guardar el alumno'
          );
        }
      },

      error: (error) => {

        console.error('Error:', error);

        if (error.error?.message) {
          alert(error.error.message);
        } else {
          alert('No se pudo conectar con el servidor');
        }
      }

    });

  }

}