export type DrinkCategory = 'Trà Sữa' | 'Trà Trái Cây' | 'Macchiato' | 'Combo Ưu Đãi';

export type SizeOption = 'M' | 'L';

export type SugarLevel = '100%' | '70%' | '50%' | '30%' | '0%';

export type IceLevel = '100%' | '70%' | '50%' | '0%';

export type PaymentMethod = 'cod' | 'vietqr' | 'momo';

export interface ToppingOption {
  id: string;
  name: string;
  price: number;
  image?: string;
}

export interface Drink {
  id: string;
  name: string;
  category: DrinkCategory;
  description: string;
  basePrice: number;
  image: string;
  alt: string;
  highlightNote?: string;
}

export interface CartItem {
  key: string;
  drinkId: string;
  drinkName: string;
  image: string;
  basePrice: number;
  size: SizeOption;
  sugar: SugarLevel;
  ice: IceLevel;
  toppings: ToppingOption[];
  note: string;
  quantity: number;
  unitPrice: number;
}

export interface PromoCode {
  code: string;
  label: string;
  type: 'percent' | 'fixed';
  value: number;
  maxDiscount?: number;
  minSubtotal: number;
}

export interface CheckoutFormState {
  fullName: string;
  phone: string;
  address: string;
  note: string;
  paymentMethod: PaymentMethod;
}

export interface CheckoutErrors {
  fullName?: string;
  phone?: string;
  address?: string;
}

export interface OrderReceipt {
  orderCode: string;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  appliedPromoCode: string | null;
  customer: CheckoutFormState;
}

export const SIZE_SURCHARGE: Record<SizeOption, number> = {
  M: 0,
  L: 8000,
};

export const FREE_SHIPPING_THRESHOLD = 150000;
export const STANDARD_SHIPPING_FEE = 18000;

export const PROMO_CODES: PromoCode[] = [
  {
    code: 'TRASUA10',
    label: 'Giảm 10% tối đa 30.000₫ cho mọi đơn',
    type: 'percent',
    value: 10,
    maxDiscount: 30000,
    minSubtotal: 0,
  },
  {
    code: 'MOC20K',
    label: 'Giảm 20.000₫ cho đơn từ 120.000₫',
    type: 'fixed',
    value: 20000,
    minSubtotal: 120000,
  },
];

export function formatVND(amount: number): string {
  const safe = Math.max(0, Math.round(amount));
  return `${safe.toLocaleString('vi-VN')}₫`;
}

export function calculateItemUnitPrice(
  basePrice: number,
  size: SizeOption,
  toppings: ToppingOption[]
): number {
  const toppingsTotal = toppings.reduce((sum, item) => sum + item.price, 0);
  return basePrice + SIZE_SURCHARGE[size] + toppingsTotal;
}

export function buildCartItemKey(
  drinkId: string,
  size: SizeOption,
  sugar: SugarLevel,
  ice: IceLevel,
  toppings: ToppingOption[],
  note: string
): string {
  const toppingIds = toppings
    .map((t) => t.id)
    .sort()
    .join(',');
  return `${drinkId}|${size}|${sugar}|${ice}|${toppingIds}|${note.trim().toLowerCase()}`;
}

export function upsertCartItem(
  items: CartItem[],
  payload: {
    drink: Pick<Drink, 'id' | 'name' | 'image' | 'basePrice'>;
    size: SizeOption;
    sugar: SugarLevel;
    ice: IceLevel;
    toppings: ToppingOption[];
    note: string;
    quantity: number;
  }
): CartItem[] {
  const safeQty = Math.max(1, Math.min(20, Math.round(payload.quantity)));
  const cleanNote = payload.note.trim();
  const key = buildCartItemKey(
    payload.drink.id,
    payload.size,
    payload.sugar,
    payload.ice,
    payload.toppings,
    cleanNote
  );
  const unitPrice = calculateItemUnitPrice(
    payload.drink.basePrice,
    payload.size,
    payload.toppings
  );

  const existingIndex = items.findIndex((item) => item.key === key);
  if (existingIndex >= 0) {
    return items.map((item, idx) =>
      idx === existingIndex
        ? { ...item, quantity: Math.min(20, item.quantity + safeQty) }
        : item
    );
  }

  return [
    ...items,
    {
      key,
      drinkId: payload.drink.id,
      drinkName: payload.drink.name,
      image: payload.drink.image,
      basePrice: payload.drink.basePrice,
      size: payload.size,
      sugar: payload.sugar,
      ice: payload.ice,
      toppings: [...payload.toppings].sort((a, b) => a.name.localeCompare(b.name)),
      note: cleanNote,
      quantity: safeQty,
      unitPrice,
    },
  ];
}

export function updateCartItemQuantity(
  items: CartItem[],
  key: string,
  delta: number
): CartItem[] {
  return items
    .map((item) => {
      if (item.key !== key) return item;
      const nextQty = item.quantity + delta;
      if (nextQty <= 0) return null;
      return { ...item, quantity: Math.min(20, nextQty) };
    })
    .filter((item): item is CartItem => item !== null);
}

export function removeCartItem(items: CartItem[], key: string): CartItem[] {
  return items.filter((item) => item.key !== key);
}

export function evaluatePromoCode(
  codeInput: string | null,
  subtotal: number,
  availablePromos: PromoCode[] = PROMO_CODES
): { promo: PromoCode | null; discount: number; error: string | null } {
  if (!codeInput || !codeInput.trim()) {
    return { promo: null, discount: 0, error: null };
  }
  const normalized = codeInput.trim().toUpperCase();
  const found = availablePromos.find((p) => p.code === normalized);
  if (!found) {
    return { promo: null, discount: 0, error: 'Mã ưu đãi không hợp lệ hoặc đã hết hạn.' };
  }
  if (subtotal < found.minSubtotal) {
    return {
      promo: null,
      discount: 0,
      error: `Mã ${found.code} áp dụng cho đơn từ ${formatVND(found.minSubtotal)}.`,
    };
  }
  let discount =
    found.type === 'percent'
      ? Math.round((subtotal * found.value) / 100)
      : found.value;
  if (found.maxDiscount !== undefined) {
    discount = Math.min(discount, found.maxDiscount);
  }
  discount = Math.min(discount, subtotal);
  return { promo: found, discount, error: null };
}

export function calculateCartTotals(
  items: CartItem[],
  promoCode: string | null
): {
  subtotal: number;
  discount: number;
  shippingFee: number;
  freeShippingRemaining: number;
  total: number;
  totalItems: number;
  appliedPromo: PromoCode | null;
  promoError: string | null;
} {
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  if (items.length === 0) {
    return {
      subtotal: 0,
      discount: 0,
      shippingFee: 0,
      freeShippingRemaining: FREE_SHIPPING_THRESHOLD,
      total: 0,
      totalItems: 0,
      appliedPromo: null,
      promoError: null,
    };
  }

  const { promo, discount, error } = evaluatePromoCode(promoCode, subtotal);
  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
  const freeShippingRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const total = Math.max(0, subtotal - discount + shippingFee);

  return {
    subtotal,
    discount,
    shippingFee,
    freeShippingRemaining,
    total,
    totalItems,
    appliedPromo: promo,
    promoError: error,
  };
}

export function filterDrinks(
  drinks: Drink[],
  category: DrinkCategory | 'Tất cả',
  query: string
): Drink[] {
  const normalizedQuery = query.trim().toLowerCase();
  return drinks.filter((drink) => {
    const matchesCategory = category === 'Tất cả' || drink.category === category;
    if (!matchesCategory) return false;
    if (!normalizedQuery) return true;
    return (
      drink.name.toLowerCase().includes(normalizedQuery) ||
      drink.description.toLowerCase().includes(normalizedQuery) ||
      drink.category.toLowerCase().includes(normalizedQuery)
    );
  });
}

export function validateCheckoutForm(form: CheckoutFormState): CheckoutErrors {
  const errors: CheckoutErrors = {};
  const trimmedName = form.fullName.trim();
  const cleanedPhone = form.phone.replace(/[\s.-]/g, '');
  const trimmedAddress = form.address.trim();

  if (trimmedName.length < 2) {
    errors.fullName = 'Vui lòng nhập họ và tên người nhận (tối thiểu 2 ký tự).';
  }

  if (!/^0\d{9,10}$/.test(cleanedPhone)) {
    errors.phone = 'Số điện thoại không hợp lệ (gồm 10–11 chữ số, bắt đầu bằng 0).';
  }

  if (trimmedAddress.length < 8) {
    errors.address = 'Vui lòng nhập địa chỉ giao hàng cụ thể hơn.';
  }

  return errors;
}

export function generateOrderCode(timestamp: number = Date.now()): string {
  const suffix = String(timestamp).slice(-5);
  return `TS-${suffix}`;
}
