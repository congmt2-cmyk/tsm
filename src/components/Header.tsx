import { ShoppingBag } from 'lucide-react';

export type ScreenName = 'home' | 'cart';

interface HeaderProps {
  activeScreen: ScreenName;
  totalItems: number;
  onNavigateHome: (sectionId?: string) => void;
  onNavigateCart: () => void;
}

export function Header({
  activeScreen,
  totalItems,
  onNavigateHome,
  onNavigateCart,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-[#ffffff]/95 backdrop-blur-sm border-b border-[#EDE9E8]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 sm:gap-8">
        {/* Zone 1: Brand Wordmark (single text element) */}
        <button
          type="button"
          onClick={() => onNavigateHome()}
          className="text-xl font-bold tracking-tight text-[#1a1c1c] hover:text-[#A8301B] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          Trà Sữa Mộc
        </button>

        {/* Zone 2: Concise single-line navigation links */}
        <nav
          aria-label="Điều hướng chính"
          className="hidden md:flex items-center gap-6 text-sm font-medium text-[#59413d]"
        >
          <button
            type="button"
            onClick={() => onNavigateHome('hero')}
            className={`hover:text-[#A8301B] transition-colors whitespace-nowrap shrink-0 cursor-pointer py-1 ${
              activeScreen === 'home' ? 'text-[#1a1c1c] font-semibold' : ''
            }`}
          >
            Trang chủ
          </button>
          <button
            type="button"
            onClick={() => onNavigateHome('menu')}
            className="hover:text-[#A8301B] transition-colors whitespace-nowrap shrink-0 cursor-pointer py-1"
          >
            Thực đơn
          </button>
          <button
            type="button"
            onClick={() => onNavigateHome('story')}
            className="hover:text-[#A8301B] transition-colors whitespace-nowrap shrink-0 cursor-pointer py-1"
          >
            Câu chuyện
          </button>
          <button
            type="button"
            onClick={() => onNavigateHome('support')}
            className="hover:text-[#A8301B] transition-colors whitespace-nowrap shrink-0 cursor-pointer py-1"
          >
            Liên hệ
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action Button */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onNavigateCart}
            aria-label={`Mở giỏ hàng, hiện có ${totalItems} ly`}
            className={`inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
              activeScreen === 'cart'
                ? 'bg-[#861705] text-white shadow-sm'
                : 'bg-[#A8301B] hover:bg-[#861705] text-white shadow-sm hover:-translate-y-0.5'
            }`}
          >
            <ShoppingBag className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span className="tabular-nums">Giỏ hàng ({totalItems})</span>
          </button>
        </div>
      </div>
    </header>
  );
}
