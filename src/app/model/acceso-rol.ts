import { Acceso } from "./acceso";
import { Rol } from "./rol";

export class AccesoRol {
    rol:Rol;
    acceso:Acceso;

    constructor(rol:Rol, acceso:Acceso){
        this.rol = rol;
        this.acceso = acceso;
    }
}
