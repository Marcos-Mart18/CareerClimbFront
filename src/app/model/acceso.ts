export class Acceso {
    idAcceso: number; // Identificador del acceso
    titulo: string;   // Título del acceso
    url: string;      // URL del acceso
    icono: string;    // Ícono del acceso
    isActive: string; // Estado (activo o no)
    subAccesos: Acceso[]; // Subaccesos relacionados
    accesoPadre?: Acceso; // Acceso padre (opcional)
    isExpanded: boolean;  // Estado de expansión (para desplegables)
  
    constructor(
      idAcceso: number,
      titulo: string,
      url: string,
      icono: string,
      isActive: string,
      accesoPadre?: Acceso,
      subAccesos: Acceso[] = [],
      isExpanded: boolean = false
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
  