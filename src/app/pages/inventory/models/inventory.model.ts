export interface InventoryResponseDTO {
  id: number;
  drugId: number;
  drugName: string;
  supplierId: number;
  supplierName: string;
  batchNumber: string;
  quantity: number;
  purchaseDate: string;
}

export interface InventoryCreateDTO {
  drugId: number;
  supplierId: number;
  batchNumber: string;
  quantity: number;
  purchaseDate: string;
}

export interface InventoryUpdateDTO {
  drugId: number;
  supplierId: number;
  batchNumber: string;
  quantity: number;
  purchaseDate: string;
}

export interface InventoryBulkItemDTO {
  drugId: number;
  supplierId: number;
  batchNumber: string;
  quantity: number;
  purchaseDate: string;
}

export interface InventoryBulkCreateDTO {
  inventories: InventoryBulkItemDTO[];
}
