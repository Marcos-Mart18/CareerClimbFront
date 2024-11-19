export class Consolidado {
    idConsolidado: number;
    titulo: string;
    isActive: string;

    constructor(idConsolidado: number, titulo: string, isActive: string) {
        this.idConsolidado = idConsolidado;
        this.titulo = titulo;
        this.isActive = isActive;
    }
}
