export enum DrugType {
Tablet = 0,
Syrup = 1,
Capsule = 2,
Injection = 3,
Ointment = 4,
Drops = 5,
Inhaler = 6,

}

export interface Drug {
  id?: number;
  name: string;
  description?: string;
  price: number;
  quantityInStock: number;
  expiryDate: Date; 
  drugType: DrugType;
}
