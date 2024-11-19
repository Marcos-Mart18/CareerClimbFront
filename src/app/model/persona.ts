export class Persona {
    idPersona: number;
    nombres: string;
    apellidos:string;
    dni:string;
    email:string;
    telefono:string;
    direccion:string;
    isActive:string;

    constructor(idPersona: number, nombres: string, apellidos:string, dni:string, email:string, telefono:string, direccion:string, isActive:string){
        this.idPersona = idPersona;
        this.nombres = nombres;
        this.apellidos = apellidos;
        this.dni = dni;
        this.email = email;
        this.telefono = telefono;
        this.direccion = direccion;
        this.isActive = isActive;
    }

}
