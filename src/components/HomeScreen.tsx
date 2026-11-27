import { useMemo, useState } from 'react';
import { MessageCircle, Phone, Search, X, ArrowRight, ShoppingBag } from 'lucide-react';
import { CATEGORIES, HERO_IMAGE, MENU_DRINKS } from '../data/menuData';
import {
  filterDrinks,
  formatVND,
  type Drink,
  type DrinkCategory,
} from '../utils/cartLogic';
import { SafeImage } from './SafeImage';

interface HomeScreenProps {
  totalCartItems: number;
  onSelectDrink: (drink: Drink) => void;
  onNavigateCart: () => void;
}

export function HomeScreen({
  totalCartItems,
  onSelectDrink,
  onNavigateCart,
}: HomeScreenProps) {
  const [selectedCategory, setSelectedCategory] = useState<DrinkCategory | 'Tất cả'>('Tất cả');
  const [searchQuery, setSearchQuery] = useState('');
  const [showZaloPanel, setShowZaloPanel] = useState(false);

  const filteredDrinks = useMemo(
    () => filterDrinks(MENU_DRINKS, selectedCategory, searchQuery),
    [selectedCategory, searchQuery]
  );

  const scrollToMenu = () => {
    const el = document.getElementById('menu');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main>
      {/* Hero Section */}
      <section id="hero" className="bg-[#EDE9E8]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
            {/* Left Copy Column */}
            <div className="lg:col-span-6 flex flex-col justify-center">
              <p className="text-sm font-medium text-[#861705] tracking-wide mb-3">
                Trà sữa thủ công · Pha chế mỗi ngày
              </p>
              <h1 className="text-4xl sm:text-5xl font-bold text-[#1a1c1c] leading-[1.18] tracking-tight max-w-xl">
                Vị Trà Nguyên Bản, Đậm Đà Từng Ngụm
              </h1>
              <p className="mt-4 text-base sm:text-lg text-[#59413d] leading-relaxed max-w-lg">
                Tuyển chọn lá trà Ô Long Bảo Lộc rang mộc và ủ tươi mỗi 4 giờ, kết hợp
                sữa tươi thanh trùng cùng trân châu đường nâu nấu chậm.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={scrollToMenu}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#A8301B] hover:bg-[#861705] text-white font-semibold text-base transition-all duration-150 shadow-sm hover:-translate-y-0.5 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>Đặt ngay</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>

                {totalCartItems > 0 && (
                  <button
                    type="button"
                    onClick={onNavigateCart}
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white hover:bg-[#f9f9f9] text-[#1a1c1c] font-semibold text-base border border-[#8c716b]/30 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4 text-[#A8301B]" aria-hidden="true" />
                    <span className="tabular-nums">Xem giỏ hàng ({totalCartItems})</span>
                  </button>
                )}
              </div>
            </div>

            {/* Right Visual Column */}
            <div className="lg:col-span-6">
              <div className="h-full min-h-[260px] sm:min-h-[340px] lg:min-h-[400px] rounded-2xl overflow-hidden shadow-md bg-white">
                <SafeImage
                  src={HERO_IMAGE}
                  alt="Hai ly trà sữa đặc biệt kèm ấm trà gốm trên bàn đá ấm áp"
                  fallbackTitle="Trà Sữa Mộc"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* 4-Column Craft Strip below Hero Split */}
          <div className="mt-10 pt-8 border-t border-[#8c716b]/20 grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <p className="text-base font-semibold text-[#1a1c1c]">Trà Ô Long Bảo Lộc</p>
              <p className="mt-1 text-sm text-[#59413d]">Thu hái thủ công mỗi vụ</p>
            </div>
            <div>
              <p className="text-base font-semibold text-[#1a1c1c]">Ủ Mới Mỗi 4 Giờ</p>
              <p className="mt-1 text-sm text-[#59413d]">Giữ trọn hương thơm tự nhiên</p>
            </div>
            <div>
              <p className="text-base font-semibold text-[#1a1c1c]">Giao Nhanh 25 Phút</p>
              <p className="mt-1 text-sm text-[#59413d]">Đóng gói giữ nhiệt riêng biệt</p>
            </div>
            <div>
              <p className="text-base font-semibold text-[#1a1c1c]">Miễn Phí Giao Hàng</p>
              <p className="mt-1 text-sm text-[#59413d]">Cho đơn từ 150.000₫</p>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Catalog Section */}
      <section id="menu" className="py-12 sm:py-16">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="text-3xl sm:text-4xl font-semibold text-[#1a1c1c] tracking-tight">
                Thực Đơn Hôm Nay
              </h2>
              <p className="mt-2 text-base text-[#59413d]">
                Chọn thức uống yêu thích và tùy chỉnh size, lượng đường, đá, topping theo đúng gu.
              </p>
            </div>
            <p className="text-sm text-[#59413d] tabular-nums shrink-0">
              Hiển thị {filteredDrinks.length} / {MENU_DRINKS.length} món
            </p>
          </div>

          {/* Filter & Search Toolbar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
            {/* Category Segmented Controls */}
            <div
              role="group"
              aria-label="Lọc theo danh mục"
              className="flex items-center gap-2 overflow-x-auto pb-1"
            >
              {CATEGORIES.map((category) => {
                const active = selectedCategory === category;
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    aria-pressed={active}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      active
                        ? 'bg-[#A8301B] text-white shadow-xs'
                        : 'bg-[#EDE9E8] text-[#59413d] hover:bg-[#e2e2e2] hover:text-[#1a1c1c]'
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="relative w-full lg:w-80 shrink-0">
              <label htmlFor="menu-search" className="sr-only">
                Tìm kiếm món trà sữa
              </label>
              <Search
                className="w-4 h-4 text-[#8c716b] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                id="menu-search"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm món trà sữa, trà trái cây..."
                className="w-full pl-10 pr-10 py-2.5 rounded-full bg-white text-sm text-[#1a1c1c] placeholder:text-[#8c716b] border border-[#e0bfb9]/70 focus:border-[#A8301B] shadow-2xs transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Xóa từ khóa tìm kiếm"
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center text-[#59413d] hover:bg-[#EDE9E8] cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Product Grid */}
          {filteredDrinks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDrinks.map((drink) => (
                <article
                  key={drink.id}
                  className="bg-white rounded-2xl shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all duration-150 flex flex-col overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => onSelectDrink(drink)}
                    aria-label={`Xem và tùy chỉnh ${drink.name}`}
                    className="aspect-[4/3] w-full overflow-hidden bg-[#EDE9E8] block cursor-pointer"
                  >
                    <SafeImage
                      src={drink.image}
                      alt={drink.alt}
                      fallbackTitle={drink.name}
                      className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-200"
                    />
                  </button>

                  <div className="p-5 flex-1 flex flex-col">
                    {/* Clean unboxed metadata (Zero-Pill Rule) */}
                    <div className="flex items-center gap-2 text-xs text-[#59413d]">
                      <span>{drink.category}</span>
                      {drink.highlightNote && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-[#861705] font-medium">
                            {drink.highlightNote}
                          </span>
                        </>
                      )}
                    </div>

                    <h3 className="mt-1.5 text-lg font-semibold text-[#1a1c1c] leading-snug">
                      {drink.name}
                    </h3>

                    <p className="mt-1.5 text-sm text-[#59413d] leading-relaxed line-clamp-2 flex-1">
                      {drink.description}
                    </p>

                    <div className="mt-5 pt-4 border-t border-[#EDE9E8] flex items-center justify-between gap-3">
                      <span className="text-lg font-bold text-[#1a1c1c] tabular-nums">
                        {formatVND(drink.basePrice)}
                      </span>
                      <button
                        type="button"
                        onClick={() => onSelectDrink(drink)}
                        aria-label={`Đặt ngay ${drink.name}`}
                        className="px-5 py-2 rounded-full bg-[#A8301B] hover:bg-[#861705] text-white text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        Đặt ngay
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-10 text-center shadow-sm max-w-lg mx-auto">
              <p className="text-lg font-semibold text-[#1a1c1c]">
                Không tìm thấy thức uống phù hợp
              </p>
              <p className="mt-1.5 text-sm text-[#59413d]">
                Thử tìm bằng từ khóa khác hoặc đặt lại bộ lọc danh mục.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('Tất cả');
                  setSearchQuery('');
                }}
                className="mt-5 px-5 py-2.5 rounded-full bg-[#A8301B] hover:bg-[#861705] text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                Xem tất cả món
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Brand Story / Craftsmanship Section */}
      <section id="story" className="py-12 sm:py-16 border-t border-[#EDE9E8] bg-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#1a1c1c] tracking-tight">
              Tỉ Mỉ Từ Lá Trà Đến Từng Hạt Trân Châu
            </h2>
            <p className="mt-2.5 text-base text-[#59413d] leading-relaxed">
              Mỗi ly trà sữa tại Mộc được cân chỉnh nhiệt độ nước và thời gian ủ chính xác
              để giữ vị trà thanh tao, không gắt chát.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="pt-4 border-t border-[#e0bfb9]">
              <h3 className="text-lg font-semibold text-[#1a1c1c]">
                01. Nguồn Trà Nguyên Lá
              </h3>
              <p className="mt-2 text-sm text-[#59413d] leading-relaxed">
                Sử dụng 100% búp trà Ô Long và hồng trà tuyển chọn tại cao nguyên Bảo Lộc,
                không pha hương liệu tổng hợp.
              </p>
            </div>
            <div className="pt-4 border-t border-[#e0bfb9]">
              <h3 className="text-lg font-semibold text-[#1a1c1c]">
                02. Trân Châu Nấu Chậm Trong Ngày
              </h3>
              <p className="mt-2 text-sm text-[#59413d] leading-relaxed">
                Hạt trân châu tươi được rim đường nâu tự nhiên theo từng mẻ nhỏ, đảm bảo
                độ dẻo mềm khi đến tay bạn.
              </p>
            </div>
            <div className="pt-4 border-t border-[#e0bfb9]">
              <h3 className="text-lg font-semibold text-[#1a1c1c]">
                03. Tùy Chỉnh Chuẩn Khẩu Vị
              </h3>
              <p className="mt-2 text-sm text-[#59413d] leading-relaxed">
                Dễ dàng chọn tỷ lệ đường, đá và 5 loại topping thủ công phù hợp cho từng
                thời điểm trong ngày.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer / Support Channels */}
      <footer id="support" className="bg-[#EDE9E8] border-t border-[#e0bfb9]/50 py-10">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <p className="text-lg font-bold text-[#1a1c1c]">Trà Sữa Mộc</p>
              <p className="mt-1 text-sm text-[#59413d]">
                Mở cửa: 08:00 – 22:00 hàng ngày · 128 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href="tel:19006868"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-sm font-medium text-[#1a1c1c] hover:text-[#A8301B] transition-colors whitespace-nowrap shrink-0"
              >
                <Phone className="w-4 h-4 text-[#A8301B]" aria-hidden="true" />
                <span className="tabular-nums">Hotline: 1900 6868</span>
              </a>

              <button
                type="button"
                onClick={() => setShowZaloPanel((prev) => !prev)}
                aria-expanded={showZaloPanel}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-sm font-medium text-[#004774] hover:bg-[#cfe5ff]/40 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" aria-hidden="true" />
                <span>Hỗ trợ Zalo OA</span>
              </button>
            </div>
          </div>

          {showZaloPanel && (
            <div className="mt-4 p-4 rounded-2xl bg-white text-sm text-[#1a1c1c] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <p>
                Tìm kiếm <strong className="font-semibold">@trasuamoc.official</strong> trên
                ứng dụng Zalo để được tư vấn đặt nhóm từ 10 ly và nhận mã ưu đãi riêng.
              </p>
              <button
                type="button"
                onClick={() => setShowZaloPanel(false)}
                className="text-xs font-semibold text-[#A8301B] hover:underline self-start sm:self-center shrink-0 cursor-pointer"
              >
                Đóng
              </button>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-[#8c716b]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#59413d]">
            <p>© 2026 Trà Sữa Mộc. Bảo lưu mọi quyền.</p>
            <p>Mã ưu đãi đang mở: TRASUA10 (giảm 10%) · MOC20K (đơn từ 120.000₫)</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
