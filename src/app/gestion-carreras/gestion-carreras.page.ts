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
      header: 'Atencion',
      message: mensaje,
      buttons: ['OK']
    });

    await alert.present();
  }

  guardarCarrera() {

    if (this.carrera.nombre.trim() === '') {
      this.mostrarAlerta(
        'El nombre de la carrera no puede estar vacío'
      );
      return;
    }

    if (this.carrera.tipo === '') {
      this.mostrarAlerta(
        'Selecciona el tipo de carrera'
      );
      return;
    }

    this.http.post(
      'http://localhost/api_ionic/guardar_carrera.php',
      this.carrera,
      {
        responseType: 'text'
      }
    ).subscribe({

      next: (respuesta) => {

        console.log('Respuesta PHP:', respuesta);

        try {

          const datos = JSON.parse(respuesta);

          if (datos.status === 'success') {

            this.mostrarAlerta(
              'Carrera guardada correctamente'
            );

            this.carrera = {
              nombre: '',
              tipo: ''
            };

          } else {

            this.mostrarAlerta(
              datos.message
            );

          }

        } catch (error) {

          console.error(
            'Respuesta recibida:',
            respuesta
          );

          this.mostrarAlerta(
            'Error en la respuesta del servidor'
          );
        }
      },

      error: (error) => {

        console.error(
          'Error al guardar carrera:',
          error
        );

        this.mostrarAlerta(
          'Error al conectar con la base de datos'
        );
      }

    });
  }
}