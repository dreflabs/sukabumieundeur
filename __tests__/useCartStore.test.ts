import { describe, it, expect, beforeEach } from 'vitest';
import { useCartStore } from '@/store/useCartStore';

describe('useCartStore', () => {
  beforeEach(() => {
    useCartStore.getState().clearCart();
    useCartStore.getState().closeCart();
  });

  it('should start with an empty cart', () => {
    const state = useCartStore.getState();
    expect(state.items).toEqual([]);
    expect(state.totalItems()).toBe(0);
    expect(state.totalPrice()).toBe(0);
    expect(state.isCartOpen).toBe(false);
  });

  it('should add a new item and open the cart', () => {
    const { addItem } = useCartStore.getState();
    
    addItem({
      id: 'item-1',
      name: 'Test Shirt',
      price: 150000,
      category: 'T-Shirt',
      image: '/test.jpg'
    });

    const state = useCartStore.getState();
    expect(state.items).toHaveLength(1);
    expect(state.items[0]).toEqual({
      id: 'item-1',
      name: 'Test Shirt',
      price: 150000,
      category: 'T-Shirt',
      image: '/test.jpg',
      quantity: 1
    });
    expect(state.isCartOpen).toBe(true);
    expect(state.totalItems()).toBe(1);
    expect(state.totalPrice()).toBe(150000);
  });

  it('should increment quantity if item already exists', () => {
    const { addItem } = useCartStore.getState();
    
    const product = {
      id: 'item-1',
      name: 'Test Shirt',
      price: 150000,
      category: 'T-Shirt',
      image: '/test.jpg'
    };

    addItem(product);
    addItem(product);

    const state = useCartStore.getState();
    expect(state.items).toHaveLength(1);
    expect(state.items[0].quantity).toBe(2);
    expect(state.totalItems()).toBe(2);
    expect(state.totalPrice()).toBe(300000);
  });

  it('should update item quantity correctly', () => {
    const { addItem, updateQuantity } = useCartStore.getState();
    
    addItem({
      id: 'item-1',
      name: 'Test Shirt',
      price: 150000,
      category: 'T-Shirt',
      image: '/test.jpg'
    });

    updateQuantity('item-1', 5);

    const state = useCartStore.getState();
    expect(state.items[0].quantity).toBe(5);
    expect(state.totalItems()).toBe(5);
    expect(state.totalPrice()).toBe(750000);
  });

  it('should remove an item correctly', () => {
    const { addItem, removeItem } = useCartStore.getState();
    
    addItem({
      id: 'item-1',
      name: 'Test Shirt',
      price: 150000,
      category: 'T-Shirt',
      image: '/test.jpg'
    });

    removeItem('item-1');

    const state = useCartStore.getState();
    expect(state.items).toHaveLength(0);
    expect(state.totalItems()).toBe(0);
  });
});
