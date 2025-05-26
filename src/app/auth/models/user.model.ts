export enum UserRole
{
    Admin = 0,
    Doctor = 1
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