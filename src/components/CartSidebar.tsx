import React from 'react';
import { CartDrawer } from './CartDrawer';

interface CartSidebarProps {
  theme: 'dark' | 'light';
}

export const CartSidebar: React.FC<CartSidebarProps> = ({ theme }) => {
  return <CartDrawer theme={theme} />;
};
