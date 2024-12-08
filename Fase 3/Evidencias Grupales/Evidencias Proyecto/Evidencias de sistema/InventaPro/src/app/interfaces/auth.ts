export interface UserAuth {
  usuarioId: number;
  nombre: string;
  apellido: string;
  email: string;
  rolId: number;
  bodegaId: number;
}

export interface Token {
  accessToken: string;
}

export interface UserLoginRequest extends UserAuth, Token {}
