// Integratsiya bo'limi uchun barcha ma'lumotlar: chap sidebar, tablar va mock jadval.

export const INTEGRATION_MENU = [
  { key: "soliq",          label: "Soliq ma'lumotlari",                                             logo: "/logo/soliq.png" },
  { key: "bank",           label: "Bank ma'lumotlari",                                              logo: "/logo/bank.png" },
  { key: "kadastr",        label: "Kadastr ma'lumotlari",                                           logo: "/logo/kadastr.png" },
  { key: "iiv",            label: "IIV YHXX ma'lumotlari",                                          logo: "/logo/iiv.png" },
  { key: "agroinspeksiya", label: "Agroinspeksiya ma'lumotlari",                                    logo: "/logo/agroinspeksiya.png" },
  { key: "investitsiya",   label: "Investitsiya, sanoat va savdo vazirligi ma'lumotlari",           logo: "/logo/investitsiya.png" },
  { key: "adliya",         label: "Adliya vazirligi ma'lumotlari",                                  logo: "/logo/adliya.png" },
  { key: "sud",            label: "Sud ma'lumotlari",                                               logo: "/logo/sud.png" },
  { key: "mib",            label: "MIB ma'lumotlari",                                               logo: "/logo/mib.png" },
  { key: "uzex",           label: "Tovar xomashyo birjasi ma'lumotlari",                            logo: "/logo/uzex.png" },
  { key: "kambagallik",    label: "Kambag'allikni qisqartirish va bandlik vazirligi ma'lumotlari",  logo: "/logo/kambagallik.png" },
  { key: "hududiy",        label: "\"Hududiy elektr tarmoqlari\" AJ ma'lumotlari",                  logo: "/logo/hududiy.png" },
];

export const SOLIQ_TABS = [
  { key: "royxatga-olish", label: "Ro'yxatga olish ma'lumotlari" },
  { key: "xodimlar",       label: "Korxonaning xodimlari ma'lumotlari" },
  { key: "ehf",            label: "Elektron hisobvaraq-fakturalar ma'lumotlari" },
  { key: "onk",            label: "Onlayn nazorat kassa texnikasi cheklari ma'lumotlari" },
  { key: "moliya",         label: "Moliyaviy hisobotlar ma'lumotlari" },
  { key: "hisobotlar",     label: "Soliq hisobotlari ma'lumotlari" },
  { key: "ijara",          label: "Ijara shartnomalari ma'lumotlari" },
  { key: "tekshiruv",      label: "Soliq tekshiruvlari ma'lumotlari" },
  { key: "qarzdorlik",     label: "Soliq organlaridan qarzdorlik ma'lumotlari" },
];

// Asosiy korxona ro'yxati — barcha jadvallar shundan foydalanadi.
export const COMPANIES = [
  { stir: "308581808", name: '"INTER ABSOLYUT" MCHJ',         holat: "",          tur: "Kameral", shakl: "MCHJ" },
  { stir: "305866650", name: '"ALYANS DISTRIBUTIONS" MCHJ XK', holat: "",          tur: "Kameral", shakl: "MCHJ XK" },
  { stir: "302653974", name: '"QIBRAY TRANSFORMATOR" QMJ',    holat: "Maqsadli",  tur: "Kameral", shakl: "QMJ" },
  { stir: "303445298", name: '"AZIYA SAFAR-TRANS" MCHJ',      holat: "Kompleks",  tur: "Kameral", shakl: "MCHJ" },
  { stir: "308170528", name: '"BLOOMSHOP" MCHJ',              holat: "Maqsadli",  tur: "Sayyor",  shakl: "MCHJ" },
  { stir: "306839889", name: '"FU XING ZHAO" MCHJ',           holat: "Kompleks",  tur: "Kameral", shakl: "MCHJ" },
  { stir: "303775465", name: '"SATTOR SANJAR TRANS" MCHJ',    holat: "Maqsadli",  tur: "Kameral", shakl: "MCHJ" },
  { stir: "207023238", name: '"HOLOS" MCHJ',                  holat: "Kompleks",  tur: "Kameral", shakl: "MCHJ" },
  { stir: "309532637", name: '"RETAIL TRADE EAST" MCHJ',      holat: "Maqsadli",  tur: "Sayyor",  shakl: "MCHJ" },
  { stir: "308173887", name: '"ART-ELECTRO" MCHJ',            holat: "Maqsadli",  tur: "Kameral", shakl: "MCHJ" },
];

const BARQARORLIK = "Bojxona organlari axborot dasturlari ma'lumotlari tahlili natijasida aniqlangan xavf darajalari";
const USTAV = [
  "Bojxona deklaratsiyasida ko'rsatilgan ma'lumotlarni ularni tasdiqlovchi xujjatlarda ko'rsatilgan ma'lumotlarga mosligi;",
  "Tovarlarning TIF TH kodiga muvofiq to'g'ri tasniflanganligi;",
  "Ma'lum qilingan bojxona qiymatining haqqoniyligi;",
  "Bojxona to'lovlarining to'g'ri hisoblanganligi va undirilganligi;",
  "Tovarlarga nisbatan ta'rif preferensiyalarni to'g'ri qo'llanilganligi;",
  "Tovarlarga nisbatan ta'rif preferensiyalarni to'g'ri qo'llanilganligi;",
  "Bojxona to'lovlari bo'yicha imtiyozlar to'g'ri qo'llanilganligi;",
  "Valyutani tartibga solish to'g'risidagi qonunchilik hujjatlari talablariga rioya etilganligi;",
  "Tovarlarga nisbatan ta'rif preferensiyalarni to'g'ri qo'llanilganligi;",
  "Valyutani tartibga solish to'g'risidagi qonunchilik hujjatlari talablariga rioya etilganligi;",
];

// 1-tab: Ro'yxatga olish ma'lumotlari (= 5-tab: Moliyaviy hisobotlar, aynan shu struktura)
export const ROYXATGA_ROWS = COMPANIES.map((c, i) => ({
  stir: c.stir,
  nomi: c.name,
  royxatSana: "20.05.2020",
  holat: c.holat,
  tugatganVaqti: "20.05.2025",
  tur: c.tur,
  shakl: "20.05.2025",
  barqarorlik: BARQARORLIK,
  ustav: USTAV[i],
}));

// 2-tab: Korxonaning xodimlari
export const XODIMLAR_ROWS = COMPANIES.map(c => ({
  stir: c.stir,
  korxona: c.name,
  jshshir: "20.05.2020",
  fish: "",
  tugSana: "20.05.2025",
  lavozim: c.tur,
  pasport: "20.05.2025",
  fuqarolik: "",
  tel: "",
  holat: c.holat,
}));

// 3-tab: Elektron hisobvaraq-fakturalar
export const EHF_ROWS = COMPANIES.map(c => ({
  ehfRaqam: c.stir,
  ehfSana:  c.stir,
  sotuvchiNomi: c.stir,
  sotuvchiStir: "20.05.2020",
  qqsSotuvchi: c.tur === "Sayyor" ? "Sayyor" : "Kameral",
  xaridorNomi: "20.05.2025",
  xaridorStir: "",
  qqsXaridor: c.tur === "Sayyor" ? "Sayyor" : "Kameral",
  komitentStir: "",
  komitentNomi: c.tur === "Sayyor" ? "Sayyor" : "Kameral",
}));

// 4-tab: Onlayn nazorat kassa texnikasi cheklari
export const ONK_ROWS = COMPANIES.map(c => ({
  sotuvchiStir: c.name,
  sotuvchiNomi: c.stir,
  checkRaqam: "20.05.2020",
  checkSana: c.holat,
  mxikKodi: "20.05.2025",
  mxikNomi: c.tur,
  mahsulot: "20.05.2025",
  olchov: c.tur,
  soni: c.tur,
  narxi: c.tur === "Sayyor" ? "Sayyor" : "Kameral",
}));
