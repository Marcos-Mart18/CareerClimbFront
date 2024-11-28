export class Doc {
    id: number;
    name: string;
    url: string;
    type: string;
    size: number;
    idDetalleDoc?: number; 
    uploadProgress: number; 
    fechaSubida: string; 

    constructor(
        id: number,
        name: string,
        url: string,
        type: string,
        size: number,
        fechaSubida: string,
        uploadProgress: number = 0, 
        idDetalleDoc?: number
    ) {
        this.id = id;
        this.name = name;
        this.url = url;
        this.type = type;
        this.size = size;
        this.uploadProgress = uploadProgress;
        this.idDetalleDoc = idDetalleDoc;
        this.fechaSubida = fechaSubida;
    }
}
