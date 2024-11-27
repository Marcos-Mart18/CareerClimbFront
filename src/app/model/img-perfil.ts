export class ImgPerfil {
    id: number;
    url: string;
    type: string;
    size: number;
    idPerfilUsuario?: number; // Campo opcional para asociar un PerfilUsuario
    uploadProgress: number; // Propiedad para el progreso de carga
    fechaSubida: string; // Nueva propiedad para la fecha de subida

    constructor(
        id: number,
        url: string,
        type: string,
        size: number,
        fechaSubida: string, // Incluimos fechaSubida en el constructor
        uploadProgress: number = 0, // Inicializamos el progreso en 0
        idPerfilUsuario?: number
    ) {
        this.id = id;
        this.url = url;
        this.type = type;
        this.size = size;
        this.uploadProgress = uploadProgress;
        this.idPerfilUsuario = idPerfilUsuario;
        this.fechaSubida = fechaSubida; // Asignamos la fecha de subida
    }
}
