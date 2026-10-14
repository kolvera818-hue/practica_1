
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import {
  AlertController,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonItem,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonList
} from '@ionic/angular';

import { API } from '../config/api.config';

@Component({
  selector: 'app-gestion-carreras',
  templateUrl: './gestion-carreras.page.html',
  styleUrls: ['./gestion-carreras.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonItem,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonButton,
    IonList
  ]
})
export class GestionCarrerasPage implements OnInit {

  carrera = {
    nombre: '',
    tipo: ''
  };

  constructor(
    private alertController: AlertController,
    private http: HttpClient
  ) {}

  ngOnInit() {}

  async mostrarAlerta(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Atención',
      message: mensaje,
      buttons: ['OK']
    });

    await alert.present();
  }

  guardarCarrera() {

    // Validar nombre
    if (this.carrera.nombre.trim() === '') {
      this.mostrarAlerta(
        'El nombre de la carrera no puede estar vacío'
      );
      return;
    }

    // Validar tipo
    if (this.carrera.tipo === '') {
      this.mostrarAlerta(
        'Selecciona el tipo de carrera'
      );
      return;
    }

    // Validar tipo permitido
    const tiposPermitidos = [
      'Licenciatura',
      'Ingenieria',
      'Maestria'
    ];

    if (!tiposPermitidos.includes(this.carrera.tipo)) {
      this.mostrarAlerta(
        'El tipo de carrera no es válido'
      );
      return;
    }

    // Enviar datos al servidor
    this.http.post(
      API.guardarCarrera,
      this.carrera,
      {
        responseType: 'text'
      }
    ).subscribe({

      next: (respuesta: string) => {

        console.log('Respuesta PHP:', respuesta);

        try {

          const datos = JSON.parse(respuesta);

          if (datos.status === 'success') {

            this.mostrarAlerta(
              datos.message ||
              'Carrera guardada correctamente'
            );

            // Limpiar formulario
            this.carrera = {
              nombre: '',
              tipo: ''
            };

          } else {

            this.mostrarAlerta(
              datos.message ||
              'No se pudo guardar la carrera'
            );

          }

        } catch (error: any) {

          console.error(
            'Error al interpretar respuesta:',
            error
          );

          console.error(
            'Respuesta recibida:',
            respuesta
          );

          this.mostrarAlerta(
            'Error en la respuesta del servidor'
          );

        }

      },

      error: (error: any) => {

        console.error(
          'Error HTTP completo:',
          error
        );

        this.mostrarAlerta(
          'Error HTTP: ' +
          error.status +
          ' - ' +
          error.message
        );

      }

    });

  }

}
