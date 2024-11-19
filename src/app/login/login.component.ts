import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { LoginDto } from '../dto/login-dto';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule,NgIf,NgClass],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginDto: LoginDto = { username: '', password: '' };
  errorMessage: string | null = null;
  isLoading: boolean = false;
  showPassword = false;

  constructor(private authService: AuthService, private router: Router) {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    this.errorMessage = null;
    this.isLoading = true;
  
    this.authService.login(this.loginDto).subscribe(
      (response: any) => {
        this.isLoading = false;
  
        console.log('Respuesta completa del backend:', response); 
  
        const token = response?.accessToken; 
  
        if (token) {
          localStorage.setItem('authToken', token); 
          alert('Su token de acceso fue enviado a su correo registrado');
          this.router.navigate(['/dashboard']); 
        } else {
          this.errorMessage = 'Error: Token no recibido.';
        }
      },
      error => {
        this.isLoading = false;
        console.error('Error de autenticación:', error);
        this.errorMessage = 'Contraseña/usuario incorrectos o no registrados.';
      }
    );
  }
  
  
  
}
