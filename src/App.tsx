/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useMemo, useState } from 'react';
import { Check } from 'lucide-react';
import { Header, type ScreenName } from './components/Header';
import { HomeScreen } from './components/HomeScreen';
import { CartScreen } from './components/CartScreen';
import { CustomizeModal } from './components/CustomizeModal';
import {
  removeCartItem,
  updateCartItemQuantity,
  upsertCartItem,
  type CartItem,
  type Drink,
  type IceLevel,
  type SizeOption,
  type SugarLevel,
  type ToppingOption,
} from './utils/cartLogic';

const CART_STORAGE_KEY = 'tra-sua-moc-cart-v1';

function loadSavedCart(): CartItem[] {
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ScreenName>('home');
  const [cartItems, setCartItems] = useState<CartItem[]>(loadSavedCart);
  const [customizingDrink, setCustomizingDrink] = useState<Drink | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch {
      // Ignore storage quota or private mode restrictions
    }
  }, [cartItems]);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = window.setTimeout(() => setToastMessage(null), 3200);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  const totalItems = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  const handleNavigateHome = (sectionId?: string) => {
    setActiveScreen('home');
    if (sectionId) {
      window.requestAnimationFrame(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNavigateCart = () => {
    setActiveScreen('cart');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = (payload: {
    drink: Drink;
    size: SizeOption;
    sugar: SugarLevel;
    ice: IceLevel;
    toppings: ToppingOption[];
    note: string;
    quantity: number;
  }) => {
    setCartItems((prev) => upsertCartItem(prev, payload));
    setCustomizingDrink(null);
    setToastMessage(`Đã thêm ${payload.quantity}× ${payload.drink.name} vào giỏ hàng`);
  };

  const handleUpdateQuantity = (key: string, delta: number) => {
    setCartItems((prev) => updateCartItemQuantity(prev, key, delta));
  };

  const handleRemoveItem = (key: string) => {
    setCartItems((prev) => removeCartItem(prev, key));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f9f9f9] text-[#1a1c1c]">
      <Header
        activeScreen={activeScreen}
        totalItems={totalItems}
        onNavigateHome={handleNavigateHome}
        onNavigateCart={handleNavigateCart}
      />

      <div className="flex-1">
        {activeScreen === 'home' ? (
          <HomeScreen
            totalCartItems={totalItems}
            onSelectDrink={(drink) => setCustomizingDrink(drink)}
            onNavigateCart={handleNavigateCart}
          />
        ) : (
          <CartScreen
            items={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onClearCart={handleClearCart}
            onBackToHome={() => handleNavigateHome()}
          />
        )}
      </div>

      <CustomizeModal
        drink={customizingDrink}
        onClose={() => setCustomizingDrink(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Non-intrusive Add-to-cart feedback toast */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 bg-[#1a1c1c] text-white px-4 py-3 rounded-2xl shadow-lg flex items-center gap-3 max-w-sm"
        >
          <span className="w-6 h-6 rounded-full bg-[#A8301B] flex items-center justify-center shrink-0">
            <Check className="w-3.5 h-3.5 text-white" aria-hidden="true" />
          </span>
          <span className="text-sm font-medium">{toastMessage}</span>
          <button
            type="button"
            onClick={handleNavigateCart}
            className="text-xs font-semibold text-[#ffb4a5] hover:text-white underline whitespace-nowrap shrink-0 cursor-pointer"
          >
            Xem giỏ
          </button>
        </div>
      )}
    </div>
  );
}
