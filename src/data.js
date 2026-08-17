import {
  Mountain, LandPlot, Landmark, Home as HomeIcon, Building2, Gift, UtensilsCrossed,
} from "lucide-react";

export const DISTRICTS = ["Qarshi", "Shahrisabz", "Kitob", "Yakkabog'", "Chiroqchi", "Qamashi", "Dehqonobod", "Muborak", "Kasbi", "Koson", "Nishon", "G'uzor"];

export const CATEGORIES = [
  { key: "mountain", uz: "Tog'li maskanlar", ru: "Горные места", en: "Mountain spots", icon: Mountain },
  { key: "water", uz: "Suv bo'yidagi maskanlar", ru: "Места у воды", en: "Waterside spots", icon: LandPlot },
  { key: "history", uz: "Tarixiy joylar", ru: "Исторические места", en: "Historic sites", icon: Landmark },
  { key: "food", uz: "Milliy taomlar", ru: "Национальная кухня", en: "National cuisine", icon: UtensilsCrossed },
  { key: "home", uz: "Uy turizmi", ru: "Домашний туризм", en: "Home stays", icon: HomeIcon },
  { key: "hotel", uz: "Mehmonxonalar", ru: "Отели", en: "Hotels", icon: Building2 },
  { key: "gift", uz: "Milliy sovg'alar", ru: "Нац. сувениры", en: "Local gifts", icon: Gift },
];

// x/y are percentage coordinates (0-100) within Qashqadaryo's own bounding box,
// used to place markers on the isolated region map in MapView.
export const PLACES = [
  { id: "miraki", name: "Miraki Eco Resort", district: "Shahrisabz", category: "mountain",
    catLabel: { uz: "Tog' dam olish maskani", ru: "Горный курорт", en: "Mountain resort" },
    rating: 4.8, trust: 63, reviews: 487, suspicious: 102, verifiedVisits: 348, realPhotos: 186,
    breakdown: { reviewAuth: 61, photoMatch: 64, freshness: 70, verifiedVisits: 79, complaints: 52 },
    complaints: [{ l: "Tozalik", v: 34 }, { l: "Xizmat", v: 27 }, { l: "Narx/reklama farqi", v: 18 }, { l: "Internet", v: 12 }, { l: "Boshqa", v: 9 }],
    achievements: [{ l: "Tabiat", v: 96 }, { l: "Joylashuv", v: 88 }, { l: "Milliy muhit", v: 82 }],
    image: "/images/kitob-dovoni.jpg", lat: 39.093, lng: 66.769, price: "$$", featured: true },
  { id: "kitob-mountain", name: "Kitob Mountain House", district: "Kitob", category: "mountain",
    catLabel: { uz: "Tog' uyi", ru: "Горный дом", en: "Mountain house" },
    rating: 4.7, trust: 91, reviews: 214, suspicious: 6, verifiedVisits: 201, realPhotos: 142,
    breakdown: { reviewAuth: 93, photoMatch: 90, freshness: 88, verifiedVisits: 94, complaints: 91 },
    complaints: [{ l: "Internet", v: 8 }, { l: "Narx", v: 5 }],
    achievements: [{ l: "Tabiat", v: 97 }, { l: "Xodimlar", v: 93 }, { l: "Xavfsizlik", v: 90 }],
    image: "/images/kitob-mountains.jpg", lat: 39.139, lng: 66.887, price: "$$", featured: true },
  { id: "shahrisabz-eco", name: "Shahrisabz Eco Resort", district: "Shahrisabz", category: "hotel",
    catLabel: { uz: "Ekomehmonxona", ru: "Эко-отель", en: "Eco resort" },
    rating: 4.6, trust: 94, reviews: 356, suspicious: 9, verifiedVisits: 320, realPhotos: 210,
    breakdown: { reviewAuth: 95, photoMatch: 92, freshness: 94, verifiedVisits: 96, complaints: 93 },
    complaints: [{ l: "Narx", v: 6 }],
    achievements: [{ l: "Xizmat", v: 96 }, { l: "Tozalik", v: 95 }, { l: "Joylashuv", v: 91 }],
    image: null, lat: 39.061, lng: 66.825, price: "$$$", featured: true },
  { id: "langar", name: "Langar Guest House", district: "Kitob", category: "home",
    catLabel: { uz: "Uy turizmi", ru: "Гостевой дом", en: "Guest house" },
    rating: 4.5, trust: 87, reviews: 128, suspicious: 4, verifiedVisits: 110, realPhotos: 76,
    breakdown: { reviewAuth: 88, photoMatch: 85, freshness: 82, verifiedVisits: 90, complaints: 88 },
    complaints: [{ l: "Xona hajmi", v: 10 }],
    achievements: [{ l: "Mehmondo'stlik", v: 94 }, { l: "Milliy taom", v: 90 }],
    image: null, lat: 39.121, lng: 66.860, price: "$", featured: false },
  { id: "qarshi-premium", name: "Qarshi Premium Hotel", district: "Qarshi", category: "hotel",
    catLabel: { uz: "Biznes mehmonxona", ru: "Бизнес-отель", en: "Business hotel" },
    rating: 4.4, trust: 85, reviews: 298, suspicious: 14, verifiedVisits: 260, realPhotos: 98,
    breakdown: { reviewAuth: 86, photoMatch: 83, freshness: 89, verifiedVisits: 84, complaints: 82 },
    complaints: [{ l: "Wi-Fi", v: 12 }, { l: "Narx", v: 9 }],
    achievements: [{ l: "Joylashuv", v: 92 }, { l: "Xizmat", v: 87 }],
    image: "/images/qarshi-bridge.jpg", lat: 38.860, lng: 65.789, price: "$$$", featured: true },
  { id: "yakkabog-lake", name: "Yakkabog' Ko'l Oromgohi", district: "Yakkabog'", category: "water",
    catLabel: { uz: "Ko'l bo'yi dam olish maskani", ru: "Курорт у озера", en: "Lakeside resort" },
    rating: 4.3, trust: 58, reviews: 176, suspicious: 41, verifiedVisits: 88, realPhotos: 34,
    breakdown: { reviewAuth: 54, photoMatch: 49, freshness: 61, verifiedVisits: 60, complaints: 51 },
    complaints: [{ l: "Xizmat", v: 34 }, { l: "Tozalik", v: 29 }],
    achievements: [{ l: "Tabiat", v: 89 }],
    image: null, lat: 38.900, lng: 66.522, price: "$$", featured: false },
  { id: "amir-temur", name: "Amir Temur Tarixiy Majmuasi", district: "Shahrisabz", category: "history",
    catLabel: { uz: "Tarixiy majmua", ru: "Исторический комплекс", en: "Historic complex" },
    rating: 4.9, trust: 96, reviews: 612, suspicious: 11, verifiedVisits: 540, realPhotos: 402,
    breakdown: { reviewAuth: 97, photoMatch: 96, freshness: 95, verifiedVisits: 97, complaints: 96 },
    complaints: [{ l: "Navbat", v: 7 }],
    achievements: [{ l: "Tarixiy qiymat", v: 99 }, { l: "Tozalik", v: 94 }],
    image: "/images/aksaray-shahrisabz.jpg", lat: 39.0525, lng: 66.8339, price: "$", featured: true },
  { id: "koson-craft", name: "Koson Hunarmandchilik Bozori", district: "Koson", category: "gift",
    catLabel: { uz: "Hunarmandchilik bozori", ru: "Ремесленный рынок", en: "Craft market" },
    rating: 4.5, trust: 80, reviews: 92, suspicious: 5, verifiedVisits: 70, realPhotos: 41,
    breakdown: { reviewAuth: 82, photoMatch: 78, freshness: 76, verifiedVisits: 80, complaints: 84 },
    complaints: [{ l: "Narx", v: 12 }],
    achievements: [{ l: "Sifat", v: 90 }],
    image: null, lat: 39.039, lng: 65.581, price: "$", featured: false },
  { id: "qashqa-oshxona", name: "Qashqadaryo Milliy Taomlar Uyi", district: "Qarshi", category: "food",
    catLabel: { uz: "Milliy taom restorani", ru: "Ресторан национальной кухни", en: "National cuisine restaurant" },
    rating: 4.7, trust: 89, reviews: 341, suspicious: 8, verifiedVisits: 275, realPhotos: 154,
    breakdown: { reviewAuth: 90, photoMatch: 88, freshness: 91, verifiedVisits: 87, complaints: 90 },
    complaints: [{ l: "Navbat", v: 9 }],
    achievements: [{ l: "Taom sifati", v: 97 }, { l: "Milliy muhit", v: 93 }],
    image: "/images/qashqadaryo-osh.jpg", lat: 38.850, lng: 65.797, price: "$$", featured: true },
];

export const TOP_LIST = [...PLACES].sort((a, b) => b.trust - a.trust);

// Compact catalog sent to the AI recommender so it only ever picks places
// that actually exist in the app.
export const PLACES_CATALOG = PLACES.map((p) => ({
  id: p.id, name: p.name, district: p.district, category: p.category, trust: p.trust, label: p.catLabel.uz,
}));

export const REVIEWS = {
  miraki: [
    { name: "Aziza M.", rating: 5, verified: true, geo: true, photos: 4, text: "Joy juda chiroyli, ammo dam olish kunlari odam ko'p.", aiScore: 94, suspicious: false, likes: 18, dislikes: 1 },
    { name: "User84721", rating: 5, verified: false, geo: false, photos: 0, text: "Eng zo'r joy!!! Hammasi ideal!!!", aiScore: 78, suspicious: true,
      reasons: ["aniq tajriba tafsilotlari yo'q", "haddan tashqari reklama uslubi", "boshqa sharhlarga o'xshashlik mavjud"], likes: 2, dislikes: 14 },
    { name: "Botir K.", rating: 3, verified: true, geo: true, photos: 6, text: "Tabiat ajoyib, lekin tozalik bilan muammolar bor edi.", aiScore: 91, suspicious: false, likes: 26, dislikes: 3 },
  ],
};

export const SAMPLE_REVIEWS_TO_TEST = [
  "Eng zo'r joy!!! Hammasi ideal!!! Albatta tavsiya qilaman!!!",
  "Xona kichik edi, lekin xodimlar juda mehribon va yordamchi bo'lishdi, 2 kecha turdik.",
  "Ajoyib!!! 5 yulduz!!! Hech qachon bunday joy ko'rmagandim!!!",
];

export const NOTIFICATIONS = {
  tourist: "Sizning rasmingiz 24 foydalanuvchiga foydali bo'ldi. +10 SafarPoint.",
  business: "Trust Score 78 dan 82 ga ko'tarildi.",
  gov: "Yakkabog' hududida yangi kritik signal aniqlandi.",
};

export const GOV_ALERTS = [
  { level: "red", text: "Yakkabog' hududidagi 2 ta maskanda xizmat sifati bo'yicha shikoyatlar 34% oshdi." },
  { level: "yellow", text: "Miraki hududidagi 3 ta obyektning reklama suratlari real turist suratlari bilan sezilarli darajada farq qilmoqda." },
  { level: "green", text: "Shahrisabz turistik obyektlarining o'rtacha Trust Score ko'rsatkichi 6% oshdi." },
];

export const DISTRICT_TRUST = DISTRICTS.map((d, i) => ({
  district: d, trust: [82, 91, 88, 61, 74, 70, 66, 77, 72, 85, 69, 63][i] ?? 70,
}));

export const VISIT_GROWTH = [
  { m: "Yan", v: 1200 }, { m: "Fev", v: 1450 }, { m: "Mar", v: 1700 },
  { m: "Apr", v: 2100 }, { m: "May", v: 2600 }, { m: "Iyun", v: 3400 },
  { m: "Iyul", v: 3900 }, { m: "Avg", v: 4600 },
];
