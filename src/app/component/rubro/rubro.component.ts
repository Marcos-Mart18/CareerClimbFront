import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { Rubro } from '../../model/rubro';
import { RubroService } from '../../service/rubro.service';

@Component({
  selector: 'app-rubro',
  standalone: true,
  imports: [TableModule],
  templateUrl: './rubro.component.html',
  styleUrl: './rubro.component.css',
})
export class RubroComponent {
  rubros: Rubro[] = [];

  constructor(private rubroService: RubroService) {}

  ngOnInit(): void {
    this.listarRubros();
  }

  listarRubros(): void {
    this.rubroService.getRubros().subscribe(
      (data: Rubro[]) => {
        this.rubros = data;
      },
      (error) => {
        console.error('Error al obtener los rubros', error);
      }
    );
  }
}
