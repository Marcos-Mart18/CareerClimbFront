import { Component } from '@angular/core';
import { SidebarComponent } from '../../LayoutDefault/sidebar/sidebar.component';
import { Carrera } from '../../model/carrera';
import { NavbarComponent } from '../../LayoutDefault/navbar/navbar.component';

@Component({
  selector: 'app-carrera',
  standalone: true,
  imports: [NavbarComponent,SidebarComponent],
  templateUrl: './carrera.component.html',
  styleUrl: './carrera.component.css'
})
export class CarreraComponent {
  carreras:Carrera[]=[];
}
