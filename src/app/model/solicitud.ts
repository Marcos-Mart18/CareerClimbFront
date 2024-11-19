import { Matricula } from "./matricula";

export class Solicitud {
    idSolicitud: number;
    razonsocial: string;
    ruc:string;
    emEmail:string;
    representante:string;
    reCargo:string;
    reEmail:string;
    isActive:string;
    matricula:Matricula;

    constructor(idSolicitud: number, razonsocial: string, ruc: string, emEmail: string, representante: string, reCargo: string, reEmail: string, isActive: string, matricula: Matricula) {
        this.idSolicitud = idSolicitud;
        this.razonsocial = razonsocial;
        this.ruc = ruc;
        this.emEmail = emEmail;
        this.representante = representante;
        this.reCargo = reCargo;
        this.reEmail = reEmail;
        this.isActive = isActive;
        this.matricula = matricula;
    }
}
