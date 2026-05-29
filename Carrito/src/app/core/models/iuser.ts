export interface IUser {
  id?: number;
  nombre?: string;
  email: string;
  password: string;
  telefono?: string;
  direccion?: string;
  ciudad?: string;
  role?: string; 
  token?: string; 
}