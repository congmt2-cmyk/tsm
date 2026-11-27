import heroMilkTeaImg from '../assets/images/hero_milk_tea_table_1794579156541.jpg';
import brownSugarImg from '../assets/images/drink_brown_sugar_boba_1794579155937.jpg';
import oolongCheeseImg from '../assets/images/drink_oolong_cheese_1794579157319.jpg';
import matchaLatteImg from '../assets/images/drink_matcha_latte_1794579157678.jpg';
import peachCitrusImg from '../assets/images/drink_peach_citrus_1794579158287.jpg';
import taroCreamImg from '../assets/images/drink_taro_cream_1794579158449.jpg';
import toppingBlackBobaImg from '../assets/images/topping_black_boba_1794579753305.jpg';
import toppingWhiteBobaImg from '../assets/images/topping_white_boba_1794579754068.jpg';
import toppingCheeseFoamImg from '../assets/images/topping_cheese_foam_1794579753674.jpg';
import toppingCoconutJellyImg from '../assets/images/topping_coconut_jelly_1794579755025.jpg';
import toppingEggPuddingImg from '../assets/images/topping_egg_pudding_1794579754972.jpg';
import type { Drink, DrinkCategory, IceLevel, SugarLevel, ToppingOption } from '../utils/cartLogic';

export const HERO_IMAGE = heroMilkTeaImg;

export const CATEGORIES: Array<DrinkCategory | 'Tất cả'> = [
  'Tất cả',
  'Trà Sữa',
  'Macchiato',
  'Trà Trái Cây',
  'Combo Ưu Đãi',
];

export const SUGAR_LEVELS: SugarLevel[] = ['100%', '70%', '50%', '30%', '0%'];

export const ICE_LEVELS: IceLevel[] = ['100%', '70%', '50%', '0%'];

export const TOPPING_OPTIONS: ToppingOption[] = [
  { id: 'black-boba', name: 'Trân châu đen đường nâu', price: 8000, image: toppingBlackBobaImg },
  { id: 'white-boba', name: 'Trân châu trắng giòn', price: 8000, image: toppingWhiteBobaImg },
  { id: 'cheese-foam', name: 'Kem phô mai muối biển', price: 12000, image: toppingCheeseFoamImg },
  { id: 'coconut-jelly', name: 'Thạch dừa thanh mát', price: 7000, image: toppingCoconutJellyImg },
  { id: 'egg-pudding', name: 'Pudding trứng mềm mịn', price: 10000, image: toppingEggPuddingImg },
];

export const MENU_DRINKS: Drink[] = [
  {
    id: 'brown-sugar-boba',
    name: 'Sữa Tươi Trân Châu Đường Đen',
    category: 'Trà Sữa',
    description:
      'Trân châu đen dẻo mềm rim đường nâu nấu chậm suốt 2 giờ, quyện cùng sữa tươi thanh trùng béo dịu.',
    basePrice: 52000,
    image: brownSugarImg,
    alt: 'Ly Sữa Tươi Trân Châu Đường Đen với vân đường nâu và trân châu đen',
    highlightNote: 'Bán chạy nhất',
  },
  {
    id: 'oolong-cheese-foam',
    name: 'Trà Sữa Ô Long Nướng Kem Phô Mai',
    category: 'Macchiato',
    description:
      'Lá trà Ô Long Bảo Lộc rang mộc thơm hậu vị, phủ lớp kem phô mai muối biển sánh mịn.',
    basePrice: 55000,
    image: oolongCheeseImg,
    alt: 'Ly Trà Sữa Ô Long Nướng phủ lớp kem phô mai sánh mịn',
    highlightNote: 'Đặc trưng quán',
  },
  {
    id: 'matcha-uji-cream',
    name: 'Matcha Uji Kem Sữa Tươi',
    category: 'Trà Sữa',
    description:
      'Bột trà xanh Uji Nhật Bản đánh tay mịn mượt, kết hợp sữa tươi lạnh và lớp kem sữa nhẹ.',
    basePrice: 58000,
    image: matchaLatteImg,
    alt: 'Ly Matcha Uji Kem Sữa Tươi phân tầng xanh ngọc và sữa trắng',
  },
  {
    id: 'peach-orange-lemongrass',
    name: 'Trà Đào Cam Sả Thanh Mát',
    category: 'Trà Trái Cây',
    description:
      'Hồng trà ủ lạnh thanh khiết kết hợp đào ngâm giòn ngọt, cam vàng tươi và sả đập dập thơm dịu.',
    basePrice: 48000,
    image: peachCitrusImg,
    alt: 'Ly Trà Đào Cam Sả Thanh Mát trang trí lát cam vàng và nhánh sả',
    highlightNote: 'Giải nhiệt',
  },
  {
    id: 'fresh-taro-milk-tea',
    name: 'Trà Sữa Khoai Môn Nghiền Tươi',
    category: 'Trà Sữa',
    description:
      'Khoai môn cao nghiền thủ công giữ nguyên thớ bùi béo tự nhiên, hòa cùng trà sữa thanh nhẹ và trân châu trắng.',
    basePrice: 54000,
    image: taroCreamImg,
    alt: 'Ly Trà Sữa Khoai Môn Nghiền Tươi với lớp khoai môn tím nhạt ở đáy ly',
  },
  {
    id: 'duo-signature-combo',
    name: 'Combo Đôi Ô Long & Đường Đen',
    category: 'Combo Ưu Đãi',
    description:
      'Bộ đôi 2 ly signature gồm Ô Long Kem Sữa và Sữa Tươi Đường Đen, tiết kiệm 15.000₫ khi đặt cùng bạn bè.',
    basePrice: 99000,
    image: heroMilkTeaImg,
    alt: 'Hai ly trà sữa đặc biệt kèm ấm trà và lá trà rang trên bàn đá',
    highlightNote: 'Tiết kiệm 15K',
  },
];
