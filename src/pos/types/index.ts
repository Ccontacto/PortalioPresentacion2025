export interface Client {
  id: string;
  name: string;
  phone: string;
  addresses: Address[];
}

export interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  zip: string;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  client: Client | null;
  address: Address | null;
  items: OrderItem[];
  total: number;
}

export interface POSContextType {
  order: Order;
  setClient: (client: Client) => void;
  setAddress: (address: Address) => void;
  addItem: (item: OrderItem) => void;
  removeItem: (itemId: string) => void;
  updateItemQuantity: (itemId: string, quantity: number) => void;
}
