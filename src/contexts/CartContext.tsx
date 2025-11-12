import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CartItem {
  id: string;
  product_id: string;
  product_name: string;
  product_price: number;
  product_image: string | null;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  totalAmount: number;
  addToCart: (product: any) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  loadCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'mustabil_cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    loadCart();
  }, []);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const loadCart = () => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  };

  const addToCart = (product: any) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.product_id === product.id);

      if (existingItem) {
        return prevItems.map(item =>
          item.product_id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        const newItem: CartItem = {
          id: `${product.id}-${Date.now()}`,
          product_id: product.id,
          product_name: product.name,
          product_price: product.price,
          product_image: product.image_url || null,
          quantity: 1,
        };
        return [...prevItems, newItem];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setItems(prevItems => prevItems.filter(item => item.product_id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setItems(prevItems =>
      prevItems.map(item =>
        item.product_id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem(CART_STORAGE_KEY);
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum, item) => sum + (item.product_price * item.quantity), 0);

  return (
    <CartContext.Provider value={{
      items,
      itemCount,
      totalAmount,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      loadCart,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
