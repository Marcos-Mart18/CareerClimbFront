export class Acceso {
  idAcceso: number;
  titulo: string;
  url: string;
  icono: string;
  isActive: string;
  accesoPadre?: { idAcceso: number } | null;
  subAccesos: Acceso[];
  isExpanded: boolean;

  constructor(
    idAcceso: number,
    titulo: string,
    url: string,
    icono: string,
    isActive: string,
    accesoPadre?: { idAcceso: number } | null,
    subAccesos: Acceso[] = [],
    isExpanded: boolean = false
  ) {
    this.idAcceso = idAcceso;
    this.titulo = titulo;
    this.url = url;
    this.icono = icono;
    this.isActive = isActive;
    this.accesoPadre = accesoPadre ?? null; // Garantiza un valor nulo si no está asignado
    this.subAccesos = subAccesos;
    this.isExpanded = isExpanded;
  }
}
