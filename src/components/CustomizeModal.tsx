import { useEffect, useState } from 'react';
import { Minus, Plus, X, Check } from 'lucide-react';
import { ICE_LEVELS, SUGAR_LEVELS, TOPPING_OPTIONS } from '../data/menuData';
import {
  calculateItemUnitPrice,
  formatVND,
  SIZE_SURCHARGE,
  type Drink,
  type IceLevel,
  type SizeOption,
  type SugarLevel,
  type ToppingOption,
} from '../utils/cartLogic';
import { SafeImage } from './SafeImage';

interface CustomizeModalProps {
  drink: Drink | null;
  onClose: () => void;
  onAddToCart: (payload: {
    drink: Drink;
    size: SizeOption;
    sugar: SugarLevel;
    ice: IceLevel;
    toppings: ToppingOption[];
    note: string;
    quantity: number;
  }) => void;
}

export function CustomizeModal({
  drink,
  onClose,
  onAddToCart,
}: CustomizeModalProps) {
  const [size, setSize] = useState<SizeOption>('M');
  const [sugar, setSugar] = useState<SugarLevel>('70%');
  const [ice, setIce] = useState<IceLevel>('70%');
  const [selectedToppings, setSelectedToppings] = useState<ToppingOption[]>([]);
  const [note, setNote] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!drink) return;
    setSize('M');
    setSugar('70%');
    setIce('70%');
    setSelectedToppings([]);
    setNote('');
    setQuantity(1);
  }, [drink]);

  useEffect(() => {
    if (!drink) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [drink, onClose]);

  if (!drink) return null;

  const toggleTopping = (topping: ToppingOption) => {
    setSelectedToppings((prev) =>
      prev.some((t) => t.id === topping.id)
        ? prev.filter((t) => t.id !== topping.id)
        : [...prev, topping]
    );
  };

  const unitPrice = calculateItemUnitPrice(drink.basePrice, size, selectedToppings);
  const lineTotal = unitPrice * quantity;

  const handleConfirm = () => {
    onAddToCart({
      drink,
      size,
      sugar,
      ice,
      toppings: selectedToppings,
      note,
      quantity,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/45 p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="customize-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white w-full sm:max-w-2xl max-h-[92vh] sm:rounded-3xl rounded-t-3xl shadow-xl flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EDE9E8]">
          <span className="text-sm font-medium text-[#59413d]">
            {drink.category}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng cửa sổ tùy chỉnh"
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#59413d] hover:bg-[#EDE9E8] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto px-6 py-5 space-y-4">
          {/* Product overview */}
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <div className="w-full sm:w-36 aspect-[4/3] rounded-2xl overflow-hidden bg-[#EDE9E8] shrink-0">
              <SafeImage
                src={drink.image}
                alt={drink.alt}
                fallbackTitle={drink.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h2
                id="customize-modal-title"
                className="text-2xl font-bold text-[#1a1c1c] leading-snug"
              >
                {drink.name}
              </h2>
              <p className="mt-1.5 text-sm text-[#59413d] leading-relaxed">
                {drink.description}
              </p>
              <p className="mt-3 text-base font-bold text-[#A8301B] tabular-nums">
                Giá gốc: {formatVND(drink.basePrice)}
              </p>
            </div>
          </div>

          {/* Size selector */}
          <fieldset>
            <legend className="text-sm font-semibold text-[#1a1c1c] mb-2.5">
              Chọn kích cỡ (Size)
            </legend>
            <div className="grid grid-cols-2 gap-3">
              {(['M', 'L'] as SizeOption[]).map((option) => {
                const active = size === option;
                const surcharge = SIZE_SURCHARGE[option];
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setSize(option)}
                    aria-pressed={active}
                    className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-between cursor-pointer ${
                      active
                        ? 'bg-[#A8301B] text-white shadow-sm'
                        : 'bg-[#f3f3f4] text-[#1a1c1c] hover:bg-[#e8e8e8]'
                    }`}
                  >
                    <span>Size {option}</span>
                    <span className="tabular-nums text-xs opacity-90">
                      {surcharge > 0 ? `+${formatVND(surcharge)}` : 'Tiêu chuẩn'}
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          {/* Sugar level */}
          <fieldset>
            <legend className="text-sm font-semibold text-[#1a1c1c] mb-2.5">
              Lượng đường
            </legend>
            <div className="flex flex-wrap gap-2">
              {SUGAR_LEVELS.map((level) => {
                const active = sugar === level;
                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setSugar(level)}
                    aria-pressed={active}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      active
                        ? 'bg-[#A8301B] text-white'
                        : 'bg-[#f3f3f4] text-[#1a1c1c] hover:bg-[#e8e8e8]'
                    }`}
                  >
                    {level === '0%' ? 'Không đường' : `${level} đường`}
                  </button>
                );
              })}
            </div>
          </fieldset>

          {/* Ice level */}
          <fieldset>
            <legend className="text-sm font-semibold text-[#1a1c1c] mb-2.5">
              Lượng đá
            </legend>
            <div className="flex flex-wrap gap-2">
              {ICE_LEVELS.map((level) => {
                const active = ice === level;
                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setIce(level)}
                    aria-pressed={active}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      active
                        ? 'bg-[#A8301B] text-white'
                        : 'bg-[#f3f3f4] text-[#1a1c1c] hover:bg-[#e8e8e8]'
                    }`}
                  >
                    {level === '0%' ? 'Không đá' : `${level} đá`}
                  </button>
                );
              })}
            </div>
          </fieldset>

          {/* Toppings */}
          <fieldset>
            <legend className="text-sm font-semibold text-[#1a1c1c] mb-2.5">
              Topping thêm (tùy chọn)
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {TOPPING_OPTIONS.map((topping) => {
                const selected = selectedToppings.some((t) => t.id === topping.id);
                return (
                  <button
                    key={topping.id}
                    type="button"
                    onClick={() => toggleTopping(topping)}
                    aria-pressed={selected}
                    className={`pl-3 pr-2 py-2 rounded-xl text-sm transition-colors flex items-center justify-between gap-2.5 cursor-pointer text-left ${
                      selected
                        ? 'bg-[#A8301B] text-white font-medium'
                        : 'bg-[#f3f3f4] text-[#1a1c1c] hover:bg-[#e8e8e8]'
                    }`}
                  >
                    <span className="flex items-center gap-2 min-w-0 flex-1">
                      <span
                        className={`w-4 h-4 rounded flex items-center justify-center shrink-0 ${
                          selected ? 'bg-white/20' : 'bg-white border border-[#8c716b]/40'
                        }`}
                      >
                        {selected && <Check className="w-3 h-3" />}
                      </span>
                      <span className="truncate">{topping.name}</span>
                    </span>

                    <span className="flex items-center gap-2 shrink-0">
                      <span className="tabular-nums text-xs opacity-90">
                        +{formatVND(topping.price)}
                      </span>
                      {topping.image && (
                        <span className="w-9 h-9 rounded-lg overflow-hidden bg-white/80 shrink-0 block">
                          <SafeImage
                            src={topping.image}
                            alt={`Minh họa ${topping.name}`}
                            className="w-full h-full object-cover"
                          />
                        </span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          {/* Note */}
          <div>
            <label
              htmlFor="drink-custom-note"
              className="block text-sm font-semibold text-[#1a1c1c] mb-2"
            >
              Ghi chú riêng cho ly này
            </label>
            <input
              id="drink-custom-note"
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={120}
              placeholder="Ví dụ: để đá riêng, ít ngọt hơn..."
              className="w-full px-4 py-2.5 rounded-xl bg-[#f3f3f4] text-sm text-[#1a1c1c] placeholder:text-[#8c716b] border border-transparent focus:border-[#A8301B] focus:bg-white transition-colors"
            />
          </div>
        </div>

        {/* Bottom action bar */}
        <div className="px-6 py-4 border-t border-[#EDE9E8] bg-[#f9f9f9] flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 bg-white rounded-full px-2 py-1 shadow-xs border border-[#EDE9E8]">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              aria-label="Giảm số lượng"
              disabled={quantity <= 1}
              className="w-9 h-9 rounded-full flex items-center justify-center text-[#1a1c1c] hover:bg-[#EDE9E8] disabled:opacity-40 transition-colors cursor-pointer"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span
              className="w-8 text-center font-semibold text-base tabular-nums text-[#1a1c1c]"
              aria-live="polite"
            >
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.min(20, q + 1))}
              aria-label="Tăng số lượng"
              className="w-9 h-9 rounded-full flex items-center justify-center text-[#1a1c1c] hover:bg-[#EDE9E8] transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleConfirm}
            className="flex-1 sm:flex-initial px-6 py-3 rounded-full bg-[#A8301B] hover:bg-[#861705] text-white font-semibold text-sm sm:text-base transition-all duration-150 shadow-sm hover:-translate-y-0.5 tabular-nums whitespace-nowrap cursor-pointer"
          >
            Thêm vào giỏ · {formatVND(lineTotal)}
          </button>
        </div>
      </div>
    </div>
  );
}
