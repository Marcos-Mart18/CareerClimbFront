export class Img {
    idImg: number;
    url:string;
    isActive:string;

    constructor(idImg: number, url: string, isActive: string) {
        this.idImg = idImg;
        this.url = url;
        this.isActive = isActive;
    }
}
