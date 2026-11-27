import { useMemo, useState, type FormEvent } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Minus,
  Plus,
  ShoppingBag,
  Tag,
  Trash2,
} from 'lucide-react';
import {
  calculateCartTotals,
  formatVND,
  FREE_SHIPPING_THRESHOLD,
  generateOrderCode,
  PROMO_CODES,
  validateCheckoutForm,
  type CartItem,
  type CheckoutErrors,
  type CheckoutFormState,
  type OrderReceipt,
  type PaymentMethod,
} from '../utils/cartLogic';
import { SafeImage } from './SafeImage';

interface CartScreenProps {
  items: CartItem[];
  onUpdateQuantity: (key: string, delta: number) => void;
  onRemoveItem: (key: string) => void;
  onClearCart: () => void;
  onBackToHome: () => void;
}

const PAYMENT_OPTIONS: Array<{ id: PaymentMethod; label: string; desc: string }> = [
  {
    id: 'cod',
    label: 'Thanh toán khi nhận hàng (COD)',
    desc: 'Trả tiền mặt hoặc quét mã cho tài xế khi giao tới',
  },
  {
    id: 'vietqr',
    label: 'Chuyển khoản VietQR',
    desc: 'Xác nhận nhanh qua ứng dụng ngân hàng nội địa',
  },
  {
    id: 'momo',
    label: 'Ví điện tử MoMo',
    desc: 'Thanh toán không chạm trong 1 bước',
  },
];

export function CartScreen({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onBackToHome,
}: CartScreenProps) {
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromoInput, setAppliedPromoInput] = useState<string | null>(null);
  const [form, setForm] = useState<CheckoutFormState>({
    fullName: '',
    phone: '',
    address: '',
    note: '',
    paymentMethod: 'cod',
  });
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [receipt, setReceipt] = useState<OrderReceipt | null>(null);

  const totals = useMemo(
    () => calculateCartTotals(items, appliedPromoInput),
    [items, appliedPromoInput]
  );

  const handleApplyPromo = (code?: string) => {
    const target = (code ?? promoInput).trim().toUpperCase();
    if (!target) {
      setAppliedPromoInput(null);
      return;
    }
    setPromoInput(target);
    setAppliedPromoInput(target);
  };

  const handleRemovePromo = () => {
    setPromoInput('');
    setAppliedPromoInput(null);
  };

  const handleSubmitOrder = (event: FormEvent) => {
    event.preventDefault();
    const validationErrors = validateCheckoutForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});

    const createdAt = new Date().toLocaleString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    const newReceipt: OrderReceipt = {
      orderCode: generateOrderCode(),
      createdAt,
      items: [...items],
      subtotal: totals.subtotal,
      discount: totals.discount,
      shippingFee: totals.shippingFee,
      total: totals.total,
      appliedPromoCode: totals.appliedPromo ? totals.appliedPromo.code : null,
      customer: { ...form },
    };

    setReceipt(newReceipt);
    onClearCart();
    setAppliedPromoInput(null);
    setPromoInput('');
  };

  // Order Confirmation Receipt State
  if (receipt) {
    const paymentLabel =
      PAYMENT_OPTIONS.find((p) => p.id === receipt.customer.paymentMethod)?.label ??
      'Thanh toán khi nhận hàng';

    return (
      <main className="py-10 sm:py-14">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-3xl shadow-sm p-6 sm:p-10">
            <div className="flex items-center gap-3 text-[#A8301B]">
              <CheckCircle2 className="w-8 h-8 shrink-0" aria-hidden="true" />
              <div>
                <p className="text-xs font-semibold tracking-wide text-[#59413d]">
                  Đơn hàng #{receipt.orderCode} · {receipt.createdAt}
                </p>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#1a1c1c]">
                  Đặt hàng thành công!
                </h1>
              </div>
            </div>

            <p className="mt-4 text-sm sm:text-base text-[#59413d] leading-relaxed">
              Quán đã nhận đơn và đang chuẩn bị pha chế. Dự kiến giao tới bạn trong vòng{' '}
              <strong className="font-semibold text-[#1a1c1c]">20–30 phút</strong>.
            </p>

            {/* Customer Details */}
            <div className="mt-6 pt-6 border-t border-[#EDE9E8] space-y-2 text-sm">
              <p className="font-semibold text-[#1a1c1c]">Thông tin giao hàng</p>
              <p className="text-[#59413d]">
                Người nhận: <span className="text-[#1a1c1c] font-medium">{receipt.customer.fullName}</span> ·{' '}
                <span className="tabular-nums text-[#1a1c1c]">{receipt.customer.phone}</span>
              </p>
              <p className="text-[#59413d]">
                Địa chỉ: <span className="text-[#1a1c1c]">{receipt.customer.address}</span>
              </p>
              <p className="text-[#59413d]">
                Thanh toán: <span className="text-[#1a1c1c]">{paymentLabel}</span>
              </p>
              {receipt.customer.paymentMethod !== 'cod' && (
                <p className="text-[#861705] font-medium">
                  Nội dung chuyển khoản: <span className="tabular-nums">{receipt.orderCode}</span> · Đã ghi nhận chờ xác nhận giao dịch
                </p>
              )}
              {receipt.customer.note && (
                <p className="text-[#59413d]">
                  Ghi chú: <span className="text-[#1a1c1c]">{receipt.customer.note}</span>
                </p>
              )}
            </div>

            {/* Itemized Summary */}
            <div className="mt-6 pt-6 border-t border-[#EDE9E8]">
              <p className="text-sm font-semibold text-[#1a1c1c] mb-3">
                Chi tiết thức uống ({receipt.items.reduce((s, i) => s + i.quantity, 0)} ly)
              </p>
              <ul className="space-y-3">
                {receipt.items.map((item) => (
                  <li
                    key={item.key}
                    className="flex items-start justify-between gap-4 text-sm"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-[#1a1c1c]">
                        <span className="tabular-nums">{item.quantity}×</span> {item.drinkName}
                      </p>
                      <p className="text-xs text-[#59413d]">
                        Size {item.size} · {item.sugar} đường · {item.ice} đá
                        {item.toppings.length > 0 &&
                          ` · ${item.toppings.map((t) => t.name).join(', ')}`}
                      </p>
                    </div>
                    <span className="font-semibold text-[#1a1c1c] tabular-nums shrink-0">
                      {formatVND(item.unitPrice * item.quantity)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Totals */}
            <div className="mt-6 pt-6 border-t border-[#EDE9E8] space-y-2 text-sm">
              <div className="flex justify-between text-[#59413d]">
                <span>Tạm tính</span>
                <span className="tabular-nums">{formatVND(receipt.subtotal)}</span>
              </div>
              <div className="flex justify-between text-[#59413d]">
                <span>Phí giao hàng</span>
                <span className="tabular-nums">
                  {receipt.shippingFee === 0 ? 'Miễn phí' : formatVND(receipt.shippingFee)}
                </span>
              </div>
              {receipt.discount > 0 && (
                <div className="flex justify-between text-[#861705]">
                  <span>Ưu đãi ({receipt.appliedPromoCode})</span>
                  <span className="tabular-nums">-{formatVND(receipt.discount)}</span>
                </div>
              )}
              <div className="pt-3 border-t border-[#EDE9E8] flex justify-between items-baseline">
                <span className="text-base font-semibold text-[#1a1c1c]">Tổng thanh toán</span>
                <span className="text-2xl font-bold text-[#A8301B] tabular-nums">
                  {formatVND(receipt.total)}
                </span>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => {
                  setReceipt(null);
                  onBackToHome();
                }}
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#A8301B] hover:bg-[#861705] text-white font-semibold text-base transition-colors cursor-pointer"
              >
                Quay về Trang Chủ
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="py-8 sm:py-12">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Screen Breadcrumb / Back Action */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <button
              type="button"
              onClick={onBackToHome}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[#59413d] hover:text-[#A8301B] transition-colors cursor-pointer mb-2"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              <span>Tiếp tục chọn món</span>
            </button>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#1a1c1c] tracking-tight">
              Giỏ hàng của bạn
            </h1>
          </div>

          {items.length > 0 && (
            <p className="text-sm text-[#59413d] tabular-nums">
              {totals.totalItems} ly trong đơn hàng
            </p>
          )}
        </div>

        {/* Empty Cart State */}
        {items.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm p-10 sm:p-14 text-center max-w-xl mx-auto my-8">
            <div className="w-16 h-16 rounded-full bg-[#EDE9E8] text-[#A8301B] flex items-center justify-center mx-auto mb-5">
              <ShoppingBag className="w-7 h-7" aria-hidden="true" />
            </div>
            <h2 className="text-2xl font-semibold text-[#1a1c1c]">
              Giỏ hàng của bạn đang trống
            </h2>
            <p className="mt-2 text-base text-[#59413d] leading-relaxed">
              Hãy khám phá thực đơn trà sữa thủ công và chọn cho mình một ly đậm vị trà nhé.
            </p>
            <button
              type="button"
              onClick={onBackToHome}
              className="mt-7 px-7 py-3.5 rounded-full bg-[#A8301B] hover:bg-[#861705] text-white font-semibold text-base transition-colors cursor-pointer"
            >
              Khám phá thực đơn
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmitOrder}
            noValidate
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
          >
            {/* Left Column: Cart Items + Customer Delivery Form */}
            <div className="lg:col-span-7 space-y-6">
              {/* Itemized Cart List */}
              <section
                aria-label="Danh sách món đã chọn"
                className="bg-white rounded-2xl shadow-sm p-5 sm:p-6"
              >
                <div className="flex items-center justify-between pb-4 border-b border-[#EDE9E8]">
                  <h2 className="text-lg font-semibold text-[#1a1c1c]">
                    Món đã chọn
                  </h2>
                  <button
                    type="button"
                    onClick={onClearCart}
                    className="text-xs font-medium text-[#59413d] hover:text-[#ba1a1a] transition-colors cursor-pointer"
                  >
                    Xóa tất cả
                  </button>
                </div>

                <ul className="divide-y divide-[#EDE9E8]">
                  {items.map((item) => (
                    <li
                      key={item.key}
                      className="py-5 first:pt-4 last:pb-1 flex flex-col sm:flex-row gap-4 sm:items-center"
                    >
                      <div className="flex gap-4 flex-1 min-w-0 items-start">
                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#EDE9E8] shrink-0">
                          <SafeImage
                            src={item.image}
                            alt={item.drinkName}
                            fallbackTitle={item.drinkName}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-semibold text-[#1a1c1c]">
                            {item.drinkName}
                          </h3>
                          <p className="mt-1 text-xs text-[#59413d] leading-relaxed">
                            Size {item.size} · {item.sugar === '0%' ? 'Không đường' : `${item.sugar} đường`} ·{' '}
                            {item.ice === '0%' ? 'Không đá' : `${item.ice} đá`}
                          </p>
                          {item.toppings.length > 0 && (
                            <p className="mt-0.5 text-xs text-[#59413d]">
                              Topping: {item.toppings.map((t) => t.name).join(', ')}
                            </p>
                          )}
                          {item.note && (
                            <p className="mt-0.5 text-xs text-[#861705]">
                              Ghi chú: {item.note}
                            </p>
                          )}
                          <p className="mt-1.5 text-sm font-medium text-[#1a1c1c] tabular-nums">
                            {formatVND(item.unitPrice)} / ly
                          </p>
                        </div>
                      </div>

                      {/* Quantity Stepper + Line Price + Remove */}
                      <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                        <div className="flex items-center gap-1 bg-[#f3f3f4] rounded-full p-1">
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.key, -1)}
                            aria-label={`Giảm số lượng ${item.drinkName}`}
                            className="w-8 h-8 rounded-full flex items-center justify-center text-[#1a1c1c] hover:bg-white transition-colors cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-7 text-center text-sm font-semibold tabular-nums text-[#1a1c1c]">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.key, 1)}
                            aria-label={`Tăng số lượng ${item.drinkName}`}
                            className="w-8 h-8 rounded-full flex items-center justify-center text-[#1a1c1c] hover:bg-white transition-colors cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <span className="w-24 text-right text-base font-bold text-[#1a1c1c] tabular-nums">
                          {formatVND(item.unitPrice * item.quantity)}
                        </span>

                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.key)}
                          aria-label={`Xóa ${item.drinkName}`}
                          className="w-9 h-9 rounded-full flex items-center justify-center text-[#59413d] hover:text-[#ba1a1a] hover:bg-[#ffdad6]/50 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Delivery Form */}
              <section
                aria-label="Thông tin giao hàng"
                className="bg-white rounded-2xl shadow-sm p-5 sm:p-6 space-y-5"
              >
                <h2 className="text-lg font-semibold text-[#1a1c1c]">
                  Thông tin nhận hàng
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="checkout-fullname"
                      className="block text-sm font-medium text-[#1a1c1c] mb-1.5"
                    >
                      Họ và tên <span className="text-[#ba1a1a]">*</span>
                    </label>
                    <input
                      id="checkout-fullname"
                      type="text"
                      value={form.fullName}
                      onChange={(e) => {
                        setForm((prev) => ({ ...prev, fullName: e.target.value }));
                        if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: undefined }));
                      }}
                      placeholder="Ví dụ: Nguyễn Minh Anh"
                      aria-invalid={Boolean(errors.fullName)}
                      className={`w-full px-4 py-2.5 rounded-xl bg-[#f3f3f4] text-sm text-[#1a1c1c] placeholder:text-[#8c716b] border transition-colors ${
                        errors.fullName
                          ? 'border-[#ba1a1a] bg-[#ffdad6]/20'
                          : 'border-transparent focus:border-[#A8301B] focus:bg-white'
                      }`}
                    />
                    {errors.fullName && (
                      <p role="alert" className="mt-1.5 text-xs text-[#ba1a1a]">
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="checkout-phone"
                      className="block text-sm font-medium text-[#1a1c1c] mb-1.5"
                    >
                      Số điện thoại <span className="text-[#ba1a1a]">*</span>
                    </label>
                    <input
                      id="checkout-phone"
                      type="tel"
                      value={form.phone}
                      onChange={(e) => {
                        setForm((prev) => ({ ...prev, phone: e.target.value }));
                        if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
                      }}
                      placeholder="Ví dụ: 0901234567"
                      aria-invalid={Boolean(errors.phone)}
                      className={`w-full px-4 py-2.5 rounded-xl bg-[#f3f3f4] text-sm text-[#1a1c1c] placeholder:text-[#8c716b] border transition-colors ${
                        errors.phone
                          ? 'border-[#ba1a1a] bg-[#ffdad6]/20'
                          : 'border-transparent focus:border-[#A8301B] focus:bg-white'
                      }`}
                    />
                    {errors.phone && (
                      <p role="alert" className="mt-1.5 text-xs text-[#ba1a1a]">
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="checkout-address"
                    className="block text-sm font-medium text-[#1a1c1c] mb-1.5"
                  >
                    Địa chỉ giao hàng <span className="text-[#ba1a1a]">*</span>
                  </label>
                  <input
                    id="checkout-address"
                    type="text"
                    value={form.address}
                    onChange={(e) => {
                      setForm((prev) => ({ ...prev, address: e.target.value }));
                      if (errors.address) setErrors((prev) => ({ ...prev, address: undefined }));
                    }}
                    placeholder="Số nhà, tên đường, phường/xã, quận/huyện..."
                    aria-invalid={Boolean(errors.address)}
                    className={`w-full px-4 py-2.5 rounded-xl bg-[#f3f3f4] text-sm text-[#1a1c1c] placeholder:text-[#8c716b] border transition-colors ${
                      errors.address
                        ? 'border-[#ba1a1a] bg-[#ffdad6]/20'
                        : 'border-transparent focus:border-[#A8301B] focus:bg-white'
                    }`}
                  />
                  {errors.address && (
                    <p role="alert" className="mt-1.5 text-xs text-[#ba1a1a]">
                      {errors.address}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="checkout-note"
                    className="block text-sm font-medium text-[#1a1c1c] mb-1.5"
                  >
                    Ghi chú cho tài xế (tùy chọn)
                  </label>
                  <input
                    id="checkout-note"
                    type="text"
                    value={form.note}
                    onChange={(e) => setForm((prev) => ({ ...prev, note: e.target.value }))}
                    placeholder="Ví dụ: Gọi khi tới cổng, không bấm chuông..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[#f3f3f4] text-sm text-[#1a1c1c] placeholder:text-[#8c716b] border border-transparent focus:border-[#A8301B] focus:bg-white transition-colors"
                  />
                </div>

                {/* Payment Method */}
                <fieldset>
                  <legend className="text-sm font-medium text-[#1a1c1c] mb-2.5">
                    Phương thức thanh toán
                  </legend>
                  <div className="space-y-2.5">
                    {PAYMENT_OPTIONS.map((option) => {
                      const active = form.paymentMethod === option.id;
                      return (
                        <label
                          key={option.id}
                          className={`flex items-start gap-3 p-3.5 rounded-xl border transition-colors cursor-pointer ${
                            active
                              ? 'border-[#A8301B] bg-[#ffdad3]/25'
                              : 'border-[#EDE9E8] bg-[#f9f9f9] hover:bg-[#f3f3f4]'
                          }`}
                        >
                          <input
                            type="radio"
                            name="paymentMethod"
                            value={option.id}
                            checked={active}
                            onChange={() =>
                              setForm((prev) => ({ ...prev, paymentMethod: option.id }))
                            }
                            className="mt-1 accent-[#A8301B]"
                          />
                          <div>
                            <span className="block text-sm font-semibold text-[#1a1c1c]">
                              {option.label}
                            </span>
                            <span className="block text-xs text-[#59413d] mt-0.5">
                              {option.desc}
                            </span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>
              </section>
            </div>

            {/* Right Column: Sticky Order Summary & Promo */}
            <aside className="lg:col-span-5 lg:sticky lg:top-24">
              <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6 space-y-5">
                <h2 className="text-lg font-semibold text-[#1a1c1c]">
                  Tóm tắt đơn hàng
                </h2>

                {/* Promo code input */}
                <div>
                  <label
                    htmlFor="promo-code-input"
                    className="block text-sm font-medium text-[#1a1c1c] mb-2"
                  >
                    Mã ưu đãi
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag
                        className="w-4 h-4 text-[#8c716b] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                        aria-hidden="true"
                      />
                      <input
                        id="promo-code-input"
                        type="text"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                        placeholder="Nhập mã (VD: TRASUA10)"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#f3f3f4] text-sm text-[#1a1c1c] placeholder:text-[#8c716b] placeholder:normal-case border border-transparent focus:border-[#A8301B] focus:bg-white uppercase"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleApplyPromo()}
                      className="px-4 py-2.5 rounded-xl bg-[#EDE9E8] hover:bg-[#e2e2e2] text-sm font-semibold text-[#1a1c1c] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      Áp dụng
                    </button>
                  </div>

                  {/* Quick-apply promo buttons */}
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    {PROMO_CODES.map((promo) => {
                      const isApplied = totals.appliedPromo?.code === promo.code;
                      return (
                        <button
                          key={promo.code}
                          type="button"
                          onClick={() =>
                            isApplied ? handleRemovePromo() : handleApplyPromo(promo.code)
                          }
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                            isApplied
                              ? 'bg-[#A8301B] text-white'
                              : 'bg-[#f3f3f4] text-[#59413d] hover:bg-[#EDE9E8]'
                          }`}
                        >
                          {promo.code} · {isApplied ? 'Đang dùng (Bỏ)' : promo.label}
                        </button>
                      );
                    })}
                  </div>

                  {totals.promoError && (
                    <p role="alert" className="mt-2 text-xs text-[#ba1a1a]">
                      {totals.promoError}
                    </p>
                  )}
                </div>

                {/* Free shipping threshold hint */}
                <div className="p-3.5 rounded-xl bg-[#EDE9E8]/70 text-xs text-[#59413d]">
                  {totals.freeShippingRemaining === 0 ? (
                    <span className="font-medium text-[#1a1c1c]">
                      Đơn hàng của bạn đã được miễn phí giao hàng!
                    </span>
                  ) : (
                    <span>
                      Mua thêm{' '}
                      <strong className="font-semibold text-[#A8301B] tabular-nums">
                        {formatVND(totals.freeShippingRemaining)}
                      </strong>{' '}
                      để được miễn phí giao hàng (từ {formatVND(FREE_SHIPPING_THRESHOLD)}).
                    </span>
                  )}
                </div>

                {/* Cost breakdown */}
                <div className="pt-4 border-t border-[#EDE9E8] space-y-2.5 text-sm">
                  <div className="flex justify-between text-[#59413d]">
                    <span>Tạm tính ({totals.totalItems} ly)</span>
                    <span className="font-medium text-[#1a1c1c] tabular-nums">
                      {formatVND(totals.subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#59413d]">
                    <span>Phí giao hàng</span>
                    <span className="font-medium text-[#1a1c1c] tabular-nums">
                      {totals.shippingFee === 0 ? 'Miễn phí' : formatVND(totals.shippingFee)}
                    </span>
                  </div>
                  {totals.discount > 0 && totals.appliedPromo && (
                    <div className="flex justify-between text-[#861705]">
                      <span>Ưu đãi ({totals.appliedPromo.code})</span>
                      <span className="font-semibold tabular-nums">
                        -{formatVND(totals.discount)}
                      </span>
                    </div>
                  )}

                  <div className="pt-3 border-t border-[#EDE9E8] flex justify-between items-baseline">
                    <span className="text-base font-semibold text-[#1a1c1c]">
                      Tổng cộng
                    </span>
                    <span className="text-2xl font-bold text-[#A8301B] tabular-nums">
                      {formatVND(totals.total)}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-full bg-[#A8301B] hover:bg-[#861705] text-white font-semibold text-base transition-all duration-150 shadow-sm hover:-translate-y-0.5 cursor-pointer"
                >
                  Xác nhận đặt hàng · {formatVND(totals.total)}
                </button>
              </div>
            </aside>
          </form>
        )}
      </div>
    </main>
  );
}
