export class RegisterDto {
    name: string;
    username: string;
    email: string;
    password: string;
    roleName: string;
    constructor(name: string, username: string, email: string, password: string, roleName: string) {
        this.name = name;
        this.username = username;
        this.email = email;
        this.password = password;
        this.roleName = roleName;
    }
}
