export class Acceso {
    idAcceso:number;
    titulo:string;
    url:string;
    icono:string;
    isActive: string;
    
    constructor(idAcceso: number, titulo: string, url: string, icono: string, isActive: string) {
        this.idAcceso = idAcceso;
        this.titulo = titulo;
        this.url = url;
        this.icono = icono;
        this.isActive = isActive;
    };
}
