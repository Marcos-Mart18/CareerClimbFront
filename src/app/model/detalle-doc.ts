export class DetalleDoc {
    idDetalleDoc: number;
    nombre: string;
    url: string;
    isActive: string;

    constructor(idDetalleDoc: number, nombre: string, url: string, isActive: string) {
        this.idDetalleDoc = idDetalleDoc;
        this.nombre = nombre;
        this.url = url;
        this.isActive = isActive;
    }
}
