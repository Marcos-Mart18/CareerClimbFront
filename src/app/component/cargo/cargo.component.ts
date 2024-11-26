import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { Cargo } from '../../model/cargo';
import { CargoService } from '../../service/cargo.service';

@Component({
  selector: 'app-cargo',
  standalone: true,
  imports: [TableModule],
  templateUrl: './cargo.component.html',
  styleUrl: './cargo.component.css',
})
export class CargoComponent {
  cargos: Cargo[] = [];

  constructor(private cargoService: CargoService) {}

  ngOnInit(): void {
    this.listarCargos();
  }

  listarCargos(): void {
    this.cargoService.getCargos().subscribe(
      (data: Cargo[]) => {
        this.cargos = data;
      },
      (error) => {
        console.error('Error al obtener los cargos', error);
      }
    );
  }
}
