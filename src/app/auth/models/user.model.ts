export enum UserRole {
  Admin = 'Admin',
  Doctor = 'Doctor'
}

export interface User
{
    id?: number;
    name : string;
    email : string;
    password : string;
    contact?: string;
    userRole : UserRole;
    
}