export class Acceso {
  idAcceso: number;
  titulo: string;
  url: string;
  icono: string;
  isActive: string;
  accesoPadre?: { idAcceso: number } | number;
  subAccesos?: Acceso[]; // Opcional
  isExpanded?: boolean; // Opcional

  constructor(
    idAcceso: number,
    titulo: string,
    url: string,
    icono: string,
    isActive: string,
    accesoPadre?: { idAcceso: number } | number,
    subAccesos?: Acceso[], // Cambiado aquí
    isExpanded?: boolean // Cambiado aquí
  ) {
    this.idAcceso = idAcceso;
    this.titulo = titulo;
    this.url = url;
    this.icono = icono;
    this.isActive = isActive;
    this.accesoPadre = accesoPadre;
    this.subAccesos = subAccesos;
    this.isExpanded = isExpanded;
  }
}
