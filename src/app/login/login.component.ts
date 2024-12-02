import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginDto } from '../dto/login-dto';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, NgIf, NgClass],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginDto: LoginDto = { username: '', password: '' };
  errorMessage: string | null = null;
  isLoading: boolean = false;
  showPassword = false;

  constructor(private authService: AuthService, private router: Router) {
    // Escuchar cambios en el almacenamiento para sincronizar entre pestañas
    window.addEventListener('storage', (event) => {
      if (event.key === 'authToken') {
        const token = localStorage.getItem('authToken');
        if (token) {
          const userResponse = confirm(
            'Ya existe una sesión activa en otra pestaña. ¿Desea cerrarla y continuar en esta pestaña?'
          );
          if (userResponse) {
            this.logoutOtherSession();
            this.activateSession(token); // Activar la sesión con el token existente
          } else {
            console.info('Manteniendo la sesión activa en la pestaña anterior.');
          }
        }
      }
    });
  }

  ngOnInit(): void {
    // Verificar si ya hay un usuario autenticado o un token en otra pestaña
    const token = localStorage.getItem('authToken');
    if (token && this.authService.isAuthenticated()) {
      const userResponse = confirm(
        'Ya existe una sesión activa. ¿Desea cerrarla y continuar en esta pestaña?'
      );
      if (userResponse) {
        this.logoutOtherSession();
        this.activateSession(token); // Activar la sesión con el token existente
      } else {
        this.router.navigate(['/']);
      }
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit(form: NgForm) {
    // Validar que el formulario esté completo antes de procesarlo
    if (form.invalid) {
      this.errorMessage = 'Por favor, complete todos los campos.';
      return;
    }

    this.errorMessage = null;
    this.isLoading = true;

    const existingToken = localStorage.getItem('authToken');
    if (existingToken) {
      const userResponse = confirm(
        'Ya existe una sesión activa en otra pestaña. ¿Desea cerrarla para iniciar sesión aquí?'
      );
      if (userResponse) {
        this.logoutOtherSession();
        this.processLogin();
      } else {
        this.isLoading = false;
        return;
      }
    } else {
      this.processLogin();
    }
  }

  processLogin() {
    this.authService.login(this.loginDto).subscribe(
      (response: any) => {
        this.isLoading = false;

        const token = response?.accessToken;

        if (token) {
          // Guardar el token en localStorage y sessionStorage
          localStorage.setItem('authToken', token);
          sessionStorage.setItem('accessToken', token);
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage = 'Error: Token no recibido.';
        }
      },
      (error) => {
        this.isLoading = false;
        console.error('Error de autenticación:', error);
        this.errorMessage = 'Contraseña/usuario incorrectos o no registrados.';
      }
    );
  }

  logoutOtherSession() {
    // Invalidar el token existente en localStorage
    localStorage.removeItem('authToken');
    console.info('Sesión anterior cerrada.');
  }

  activateSession(token: string) {
    // Reactivar la sesión con el token existente
    sessionStorage.setItem('accessToken', token);
    localStorage.setItem('authToken', token); // Asegurarse de que el token esté en localStorage
    console.info('Sesión activada en esta pestaña.');
    this.router.navigate(['/dashboard']);
  }
}
