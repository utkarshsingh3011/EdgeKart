import React from 'react';
import { EmptyState } from './EmptyState';

interface EmptyCartProps {
  theme: 'dark' | 'light';
  onContinueShopping: () => void;
}

export const EmptyCart: React.FC<EmptyCartProps> = ({ theme, onContinueShopping }) => {
  return (
    <EmptyState
      type="cart"
      theme={theme}
      onAction={onContinueShopping}
      actionText="Continue Shopping"
      customTitle="Your cart is empty"
      customDescription="Power your next embedded prototyping project by adding some hardware modules to your shopping cart."
    />
  );
};
