import { Component } from '@angular/core';
import { NavbarComponent } from '../../LayoutDefault/navbar/navbar.component';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { Solicitud } from '../../model/solicitud';
import { SolicitudService } from '../../service/solicitud.service';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-solicitud',
  standalone: true,
  imports: [NavbarComponent,ButtonModule,CardModule,NgFor,RouterLink,NgIf],
  templateUrl: './solicitud.component.html',
  styleUrl: './solicitud.component.css'
})
export class SolicitudComponent {
  solicitudes:Solicitud[] = [];

  constructor(
    private solicitudService:SolicitudService) { 
  }

  ngOnInit():void{
    this.listarSolicitudes();
  }

  listarSolicitudes(): void {
      this.solicitudService.getSolicitudes().subscribe(
      (data: Solicitud[]) => {
        this.solicitudes = data;
      },
      (error) => {
        console.error('Error al obtener los accesos', error);
      }
    );
  }
}
