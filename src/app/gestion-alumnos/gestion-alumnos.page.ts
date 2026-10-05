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
  selector: 'app-gestion-alumnos',
  templateUrl: './gestion-alumnos.page.html',
  styleUrls: ['./gestion-alumnos.page.scss'],
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
export class GestionAlumnosPage implements OnInit {

  alumnos = {
    n_control: '',
    nombre: '',
    s_nombre: '',
    apat: '',
    amat: '',
    fecha_nac: '',
    genero: '',
    fk_carrera: 0
  };

  listaCarreras: any[] = [];

  constructor(
    private alertController: AlertController,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.obtenerCarreras();
  }

  async mostrarAlerta(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Atencion',
      message: mensaje,
      buttons: ['OK']
    });

    await alert.present();
  }

  obtenerCarreras() {

    this.http.get<any>(
      'http://localhost/api_ionic/obtener_carreras.php'
    ).subscribe({

      next: (respuesta) => {

        console.log('Carreras recibidas:', respuesta);

        if (respuesta.status === 'success') {
          this.listaCarreras = respuesta.carreras;
        } else {
          this.mostrarAlerta(
            respuesta.message || 'No se pudieron cargar las carreras'
          );
        }

      },

      error: (error) => {
        console.error('Error al obtener carreras:', error);
        this.mostrarAlerta(
          'Error al cargar las carreras'
        );
      }

    });
  }

  validarGuardar() {

    if (this.alumnos.n_control.trim() === '') {
      this.mostrarAlerta(
        'La matrícula no puede estar vacía'
      );
      return;
    }

    if (this.alumnos.nombre.trim() === '') {
      this.mostrarAlerta(
        'El nombre no puede estar vacío'
      );
      return;
    }

    if (this.alumnos.apat.trim() === '') {
      this.mostrarAlerta(
        'El apellido paterno no puede estar vacío'
      );
      return;
    }

    if (this.alumnos.amat.trim() === '') {
      this.mostrarAlerta(
        'El apellido materno no puede estar vacío'
      );
      return;
    }

    if (this.alumnos.fecha_nac === '') {
      this.mostrarAlerta(
        'La fecha de nacimiento no puede estar vacía'
      );
      return;
    }

    const nacimiento =
      new Date(this.alumnos.fecha_nac + 'T00:00:00');

    const hoy = new Date();

    let edad =
      hoy.getFullYear() - nacimiento.getFullYear();

    const mes =
      hoy.getMonth() - nacimiento.getMonth();

    if (
      mes < 0 ||
      (mes === 0 &&
        hoy.getDate() < nacimiento.getDate())
    ) {
      edad--;
    }

    if (edad < 12) {
      this.mostrarAlerta(
        'El alumno debe tener mínimo 12 años'
      );
      return;
    }

    if (edad > 100) {
      this.mostrarAlerta(
        'La edad máxima permitida es de 100 años'
      );
      return;
    }

    if (this.alumnos.genero === '') {
      this.mostrarAlerta(
        'Selecciona un género'
      );
      return;
    }

    if (
      this.alumnos.fk_carrera === 0 ||
      !this.alumnos.fk_carrera
    ) {
      this.mostrarAlerta(
        'Selecciona una carrera'
      );
      return;
    }

    this.guardarAlumno();
  }

  guardarAlumno() {

    this.http.post<any>(
      'http://localhost/api_ionic/guardar_estudiante.php',
      this.alumnos
    ).subscribe({

      next: (respuesta) => {

        console.log(
          'Respuesta del servidor:',
          respuesta
        );

        if (respuesta.status === 'success') {

          this.mostrarAlerta(
            respuesta.message ||
            'Alumno guardado correctamente'
          );

          this.limpiarFormulario();

        } else {

          // Aquí mostrará el motivo real:
          // matrícula duplicada, datos incorrectos, etc.
          this.mostrarAlerta(
            respuesta.message ||
            'No se pudo guardar el alumno'
          );
        }
      },

      error: (error) => {

        console.error(
          'Error al guardar alumno:',
          error
        );

        // Si PHP devuelve un mensaje de error,
        // intentamos mostrarlo.
        if (error.error?.message) {

          this.mostrarAlerta(
            error.error.message
          );

        } else {

          this.mostrarAlerta(
            'No se pudo conectar con el servidor'
          );
        }
      }

    });
  }

  limpiarFormulario() {

    this.alumnos = {
      n_control: '',
      nombre: '',
      s_nombre: '',
      apat: '',
      amat: '',
      fecha_nac: '',
      genero: '',
      fk_carrera: 0
    };
  }
}