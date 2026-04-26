import maldives from "@/assets/dest-maldives.jpg";
import paris from "@/assets/dest-paris.jpg";
import dubai from "@/assets/dest-dubai.jpg";
import kyoto from "@/assets/dest-kyoto.jpg";
import petra from "@/assets/dest-petra.jpg";
import bali from "@/assets/dest-bali.jpg";

export type OfferType = "flight" | "hotel" | "trip";

export interface Offer {
  id: string;
  type: OfferType;
  titleEn: string;
  titleAr: string;
  subtitleEn: string;
  subtitleAr: string;
  city: string;
  country: string;
  price: number;
  rating: number;
  duration: string;
  image: string;
  special?: boolean;
}

export const OFFERS: Offer[] = [
  { id: "o1", type: "hotel", titleEn: "Maldives Overwater Villa", titleAr: "فيلا فوق الماء — جزر المالديف", subtitleEn: "5★ resort • All inclusive", subtitleAr: "منتجع 5★ • شامل كليًا", city: "Malé", country: "Maldives", price: 480, rating: 4.9, duration: "5 nights", image: maldives, special: true },
  { id: "o2", type: "trip", titleEn: "Romantic Paris Getaway", titleAr: "إجازة باريس الرومانسية", subtitleEn: "Flights + boutique hotel", subtitleAr: "طيران + فندق بوتيك", city: "Paris", country: "France", price: 920, rating: 4.7, duration: "4 nights", image: paris },
  { id: "o3", type: "flight", titleEn: "Direct flight to Dubai", titleAr: "رحلة مباشرة إلى دبي", subtitleEn: "Emirates • 6h 20m direct", subtitleAr: "طيران الإمارات • 6 ساعات و20 دقيقة", city: "Dubai", country: "UAE", price: 310, rating: 4.6, duration: "6h 20m", image: dubai, special: true },
  { id: "o4", type: "trip", titleEn: "Cherry Blossom Kyoto", titleAr: "إزهار الكرز في كيوتو", subtitleEn: "Cultural tour • Spring", subtitleAr: "جولة ثقافية • الربيع", city: "Kyoto", country: "Japan", price: 1450, rating: 4.8, duration: "7 nights", image: kyoto },
  { id: "o5", type: "trip", titleEn: "Petra Desert Adventure", titleAr: "مغامرة بترا الصحراوية", subtitleEn: "Guided tour • 3 nights", subtitleAr: "جولة مع مرشد • 3 ليالٍ", city: "Petra", country: "Jordan", price: 540, rating: 4.7, duration: "3 nights", image: petra },
  { id: "o6", type: "hotel", titleEn: "Bali Jungle Retreat", titleAr: "ملاذ غابات بالي", subtitleEn: "Eco resort • Spa", subtitleAr: "منتجع بيئي • سبا", city: "Ubud", country: "Indonesia", price: 220, rating: 4.5, duration: "4 nights", image: bali, special: true },
];
