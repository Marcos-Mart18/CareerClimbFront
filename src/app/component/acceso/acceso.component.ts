import { Component } from '@angular/core';
import { Acceso } from '../../model/acceso';
import { AccesoService } from '../../service/acceso.service';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-acceso',
  standalone: true,
  imports: [TableModule],
  templateUrl: './acceso.component.html',
  styleUrl: './acceso.component.css'
})
export class AccesoComponent {
  accesos:Acceso[]=[];

  constructor(
    private accessoService:AccesoService
  ){}

  ngOnInit():void{
    this.listarAccesos();
  }

  listarAccesos(): void {
    this.accessoService.getAccesos().subscribe(
      (data: Acceso[]) => {
        this.accesos = data;
      },
      (error) => {
        console.error('Error al obtener los accesos', error);
      }
    );
  }
}
