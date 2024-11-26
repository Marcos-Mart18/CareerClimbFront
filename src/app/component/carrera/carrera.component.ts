import { Component } from '@angular/core';
import { SidebarComponent } from '../../LayoutDefault/sidebar/sidebar.component';
import { Carrera } from '../../model/carrera';
import { NavbarComponent } from '../../LayoutDefault/navbar/navbar.component';
import { TableModule } from 'primeng/table';
import { CarreraService } from '../../service/carrera.service';

@Component({
  selector: 'app-carrera',
  standalone: true,
  imports: [TableModule],
  templateUrl: './carrera.component.html',
  styleUrl: './carrera.component.css',
})
export class CarreraComponent {
  carreras: Carrera[] = [];

  constructor(private carreraService: CarreraService) {}

  ngOnInit(): void {
    this.listarCarreras();
  }

  listarCarreras(): void {
    this.carreraService.getCarreras().subscribe(
      (data: Carrera[]) => {
        this.carreras = data;
      },
      (error) => {
        console.error('Error al obtener las carreras', error);
      }
    );
  }
}
