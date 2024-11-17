import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom, Subject } from 'rxjs';
import { Token, UserAuth, UserLoginRequest } from '../interfaces/auth';
import { Router } from '@angular/router';

const USER_KEY = 'User';
const TOKEN_KEY = 'Token';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiUrl = environment.api + 'Auth';

  httpClient = inject(HttpClient);
  router = inject(Router);

  private loggedInSubject = new Subject<boolean>();

  loggedIn$ = this.loggedInSubject.asObservable();

  constructor() {
    if (this.getUser() && this.getToken()) {
      this.loggedInSubject.next(true);
    } else {
      this.loggedInSubject.next(false);
    }
  }

  async login(email: string, password: string) {
    try {
      const req = await lastValueFrom(
        this.httpClient.post<UserLoginRequest>(
          `${this.apiUrl}`,
          { email: email, password: password },
          { withCredentials: true }
        )
      );
      this.setToken(req.accessToken);
      const user: UserAuth = {
        usuarioId: req.usuarioId,
        email: req.email,
        apellido: req.apellido,
        nombre: req.nombre,
        rolId: req.rolId,
        bodegaId: req.bodegaId,
      };
      this.setUser(user);
      this.loggedInSubject.next(true);
      return req;
    } catch (error) {
      throw error;
    }
  }

  async refreshToken() {
    try {
      const req = await lastValueFrom(
        this.httpClient.get<Token>(`${this.apiUrl}`, { withCredentials: true })
      );
      this.setToken(req.accessToken);
      return req;
    } catch (error) {
      throw error;
    }
  }

  getToken() {
    return localStorage.getItem(TOKEN_KEY) || null;
  }

  setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  }

  getUser() {
    var userAsString = localStorage.getItem(USER_KEY) || '';
    if (userAsString == '') {
      return null;
    }
    return JSON.parse(userAsString);
  }

  setUser(user: UserAuth) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  async isLoggedIn() {
    const user = this.getUser();
    const token = this.getToken();

    if (!user || !token) {
      return false;
    }

    const tokenPayload = JSON.parse(atob(token.split('.')[1]));
    const expiry = tokenPayload.exp;
    const currentTime = Math.floor(new Date().getTime() / 1000);

    if (currentTime >= expiry) {
      try {
        await this.refreshToken();
        return true;
      } catch (error) {
        return false;
      }
    }

    return true;
  }

  async logOut() {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
    this.loggedInSubject.next(false);
    this.router.navigate(['login'], { replaceUrl: true });
  }

  hasPermission(permiso: string) {
    const token = this.getToken()!;

    const tokenPayload = JSON.parse(atob(token.split('.')[1]));

    if (tokenPayload.permiso && tokenPayload.permiso.includes(permiso)) {
      return true;
    }

    return false;
  }
}
