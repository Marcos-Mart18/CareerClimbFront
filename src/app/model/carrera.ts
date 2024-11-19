export class Carrera {
    idCarrera: number;
    nombre: string;
    directorCarrera: number;
    nroEstudiantes: number;
    isActive: string;

    constructor(idCarrera: number, nombre: string, directorCarrera: number, nroEstudiantes: number, isActive: string) {
        this.idCarrera = idCarrera;
        this.nombre = nombre;
        this.directorCarrera = directorCarrera;
        this.nroEstudiantes = nroEstudiantes;
        this.isActive = isActive;
    }
}
