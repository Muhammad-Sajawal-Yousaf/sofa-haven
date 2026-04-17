import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem } from '../types';

export interface Location {
  name: string;
  fee: number;
}

export const LOCATIONS: Location[] = [
  { name: 'London', fee: 20 },
  { name: 'Manchester', fee: 30 },
  { name: 'Birmingham', fee: 25 },
  { name: 'Glasgow', fee: 40 },
  { name: 'Other (UK)', fee: 50 },
];

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (index: number) => void;
  updateQuantity: (index: number, quantity: number) => void;
  clearCart: () => void;
  total: number;
  deliveryLocation: Location | null;
  setDeliveryLocation: (location: Location) => void;
  deliveryFee: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [deliveryLocation, setDeliveryLocation] = useState<Location | null>(null);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    const savedLocation = localStorage.getItem('deliveryLocation');
    if (savedLocation) {
      setDeliveryLocation(JSON.parse(savedLocation));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (deliveryLocation) {
      localStorage.setItem('deliveryLocation', JSON.stringify(deliveryLocation));
    }
  }, [deliveryLocation]);

  const addToCart = (item: CartItem) => {
    setCart(prev => [...prev, item]);
  };

  const removeFromCart = (index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  const updateQuantity = (index: number, quantity: number) => {
    setCart(prev => prev.map((item, i) => i === index ? { ...item, quantity } : item));
  };

  const clearCart = () => {
    setCart([]);
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = deliveryLocation ? deliveryLocation.fee : 0;

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart, 
      total,
      deliveryLocation,
      setDeliveryLocation,
      deliveryFee
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
