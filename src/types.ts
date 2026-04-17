export interface Variant {
  id: string;
  name: string;
  price: number;
  image: string;
}

export interface Extra {
  id: string;
  name: string;
  price: number;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  images: string[];
  variants: Variant[];
  extras: Extra[];
  rating: number;
  reviews: Review[];
}

export interface CartItem {
  productId: string;
  productName: string;
  variantId: string;
  variantName: string;
  extras: Extra[];
  quantity: number;
  price: number;
  image: string;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  address: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
}
