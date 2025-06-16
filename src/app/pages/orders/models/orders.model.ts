export interface OrderItemResponseDto {
  drugName: string;
  quantity: number;
  unitPrice: number;
}

export interface OrderResponseDto {
  id: number;
  status: string;
  orderDate: string;
  doctorName: string;
  verifiedBy?: string;
  verifiedAt?: string;
  pickedUpAt?: string;
  totalAmount: number;
  items: OrderItemResponseDto[];
}

export interface OrderCreateItemDto {
  drugId: number;
  quantity: number;
}

export interface OrderCreateDto {
  doctorId: number;
  items: OrderCreateItemDto[];
}

export interface OrderVerifyDto {
  verifiedByAdminId: number;
}

export interface OrderPickupDto {
  pickedUpAt: string;
}
