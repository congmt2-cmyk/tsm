import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateCartTotals,
  calculateItemUnitPrice,
  filterDrinks,
  formatVND,
  removeCartItem,
  updateCartItemQuantity,
  upsertCartItem,
  validateCheckoutForm,
  type Drink,
  type ToppingOption,
} from './cartLogic';

const sampleToppings: ToppingOption[] = [
  { id: 'black-boba', name: 'Trân châu đen', price: 8000 },
  { id: 'cheese-foam', name: 'Kem phô mai', price: 12000 },
];

const sampleDrinks: Drink[] = [
  {
    id: 'brown-sugar',
    name: 'Sữa Tươi Trân Châu Đường Đen',
    category: 'Trà Sữa',
    description: 'Đường đen nấu chậm cùng sữa tươi thanh trùng.',
    basePrice: 52000,
    image: '/img/1.jpg',
    alt: 'Sữa tươi trân châu đường đen',
  },
  {
    id: 'peach-tea',
    name: 'Trà Đào Cam Sả Thanh Mát',
    category: 'Trà Trái Cây',
    description: 'Trà đen ủ lạnh cùng đào giòn và sả tươi.',
    basePrice: 48000,
    image: '/img/2.jpg',
    alt: 'Trà đào cam sả',
  },
];

test('formatVND formats Vietnamese currency cleanly', () => {
  assert.equal(formatVND(55000), '55.000₫');
  assert.equal(formatVND(0), '0₫');
});

test('calculateItemUnitPrice adds size L surcharge and selected toppings', () => {
  assert.equal(calculateItemUnitPrice(52000, 'M', []), 52000);
  assert.equal(calculateItemUnitPrice(52000, 'L', sampleToppings), 52000 + 8000 + 20000);
});

test('upsertCartItem merges identical customizations and separates distinct ones', () => {
  let cart = upsertCartItem([], {
    drink: sampleDrinks[0],
    size: 'M',
    sugar: '70%',
    ice: '50%',
    toppings: [sampleToppings[0]],
    note: '',
    quantity: 1,
  });
  assert.equal(cart.length, 1);
  assert.equal(cart[0].quantity, 1);

  cart = upsertCartItem(cart, {
    drink: sampleDrinks[0],
    size: 'M',
    sugar: '70%',
    ice: '50%',
    toppings: [sampleToppings[0]],
    note: '',
    quantity: 2,
  });
  assert.equal(cart.length, 1);
  assert.equal(cart[0].quantity, 3);

  cart = upsertCartItem(cart, {
    drink: sampleDrinks[0],
    size: 'L',
    sugar: '70%',
    ice: '50%',
    toppings: [sampleToppings[0]],
    note: '',
    quantity: 1,
  });
  assert.equal(cart.length, 2);
});

test('updateCartItemQuantity and removeCartItem mutate immutably', () => {
  const initial = upsertCartItem([], {
    drink: sampleDrinks[0],
    size: 'M',
    sugar: '100%',
    ice: '100%',
    toppings: [],
    note: '',
    quantity: 2,
  });
  const key = initial[0].key;
  const incremented = updateCartItemQuantity(initial, key, 1);
  assert.equal(incremented[0].quantity, 3);

  const decrementedOut = updateCartItemQuantity(initial, key, -2);
  assert.equal(decrementedOut.length, 0);

  const removed = removeCartItem(initial, key);
  assert.equal(removed.length, 0);
});

test('calculateCartTotals computes shipping, free-shipping threshold, and promo discounts', () => {
  const twoCups = upsertCartItem([], {
    drink: sampleDrinks[0],
    size: 'M',
    sugar: '70%',
    ice: '70%',
    toppings: [],
    note: '',
    quantity: 2,
  });
  // Subtotal = 104,000 (< 150,000 => shipping 18,000)
  const underFree = calculateCartTotals(twoCups, 'TRASUA10');
  assert.equal(underFree.subtotal, 104000);
  assert.equal(underFree.discount, 10400);
  assert.equal(underFree.shippingFee, 18000);
  assert.equal(underFree.total, 104000 - 10400 + 18000);
  assert.equal(underFree.freeShippingRemaining, 46000);

  // MOC20K requires 120,000 minimum
  const ineligible = calculateCartTotals(twoCups, 'MOC20K');
  assert.equal(ineligible.discount, 0);
  assert.ok(ineligible.promoError !== null);

  // 3 cups = 156,000 (>= 150,000 => free shipping)
  const threeCups = updateCartItemQuantity(twoCups, twoCups[0].key, 1);
  const freeShip = calculateCartTotals(threeCups, 'MOC20K');
  assert.equal(freeShip.shippingFee, 0);
  assert.equal(freeShip.discount, 20000);
  assert.equal(freeShip.total, 156000 - 20000);
});

test('filterDrinks filters by category and Vietnamese text query', () => {
  assert.equal(filterDrinks(sampleDrinks, 'Tất cả', '').length, 2);
  assert.equal(filterDrinks(sampleDrinks, 'Trà Trái Cây', '').length, 1);
  assert.equal(filterDrinks(sampleDrinks, 'Tất cả', 'đào').length, 1);
  assert.equal(filterDrinks(sampleDrinks, 'Trà Sữa', 'đào').length, 0);
});

test('validateCheckoutForm enforces required Vietnamese customer fields', () => {
  const invalid = validateCheckoutForm({
    fullName: '',
    phone: '123',
    address: 'Q1',
    note: '',
    paymentMethod: 'cod',
  });
  assert.ok(invalid.fullName);
  assert.ok(invalid.phone);
  assert.ok(invalid.address);

  const valid = validateCheckoutForm({
    fullName: 'Nguyễn Minh Anh',
    phone: '0901 234 567',
    address: '128 Nguyễn Huệ, Quận 1, TP.HCM',
    note: 'Ít đá riêng',
    paymentMethod: 'vietqr',
  });
  assert.deepEqual(valid, {});
});
