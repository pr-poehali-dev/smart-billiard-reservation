export type Tab = "booking" | "scan" | "profile" | "history" | "more";
export type SubPage =
  | null
  | "rating"
  | "notifications"
  | "payments"
  | "promo"
  | "records";

export const CLUBS = [
  { id: 1, name: "Пирамида Premium", address: "ул. Арбат, 12", rating: 4.9, tables: 8, free: 3, price: 1200, distance: "0.3 км", lat: 55.7522, lng: 37.5934, tag: "Топ" },
  { id: 2, name: "Green Baize Club", address: "Ленинский пр., 45", rating: 4.7, tables: 6, free: 1, price: 900, distance: "1.1 км", lat: 55.7088, lng: 37.5709, tag: "" },
  { id: 3, name: "Бильярдный дворец", address: "ул. Тверская, 88", rating: 4.5, tables: 12, free: 5, price: 800, distance: "2.4 км", lat: 55.7785, lng: 37.5969, tag: "Рядом" },
  { id: 4, name: "Cube & Cue", address: "Садовая-Кудринская, 9", rating: 4.8, tables: 5, free: 0, price: 1500, distance: "3.0 км", lat: 55.7644, lng: 37.5867, tag: "VIP" },
  { id: 5, name: "King Pool", address: "Цветной бул., 21", rating: 4.6, tables: 7, free: 2, price: 1000, distance: "1.8 км", lat: 55.7705, lng: 37.6203, tag: "" },
  { id: 6, name: "Snooker House", address: "Чистопрудный, 4", rating: 4.8, tables: 4, free: 1, price: 1100, distance: "2.6 км", lat: 55.7635, lng: 37.6448, tag: "Снукер" },
];

export const HISTORY = [
  { id: 1, club: "Пирамида Premium", date: "18 мая, 20:00–22:00", table: "Стол №3", amount: 2400, status: "завершено" },
  { id: 2, club: "Green Baize Club", date: "12 мая, 15:00–17:00", table: "Стол №1", amount: 1800, status: "завершено" },
  { id: 3, club: "Бильярдный дворец", date: "5 мая, 19:00–20:30", table: "Стол №7", amount: 1200, status: "отменено" },
];

export const NOTIFICATIONS = [
  { id: 1, icon: "Bell", title: "Стол освободился", text: "Стол №3 в Пирамида Premium свободен прямо сейчас", time: "5 мин", unread: true },
  { id: 2, icon: "Trophy", title: "Новое достижение", text: "Вы набрали 1000 очков рейтинга!", time: "1 ч", unread: true },
  { id: 3, icon: "Tag", title: "Промокод активирован", text: "Скидка 20% на следующее бронирование", time: "вчера", unread: false },
  { id: 4, icon: "Calendar", title: "Напоминание", text: "Ваша игра сегодня в 20:00 в Пирамида Premium", time: "вчера", unread: false },
];

export const PAYMENTS = [
  { id: 1, desc: "Бронирование · Пирамида Premium", date: "18 мая", amount: -2400, type: "debit" },
  { id: 2, desc: "Пополнение баланса", date: "15 мая", amount: 5000, type: "credit" },
  { id: 3, desc: "Бронирование · Green Baize", date: "12 мая", amount: -1800, type: "debit" },
  { id: 4, desc: "Кэшбэк за бронирование", date: "12 мая", amount: 90, type: "credit" },
  { id: 5, desc: "Бронирование · Бильярдный дворец", date: "5 мая", amount: -1200, type: "debit" },
];

export const RECORDS = [
  { id: 1, date: "18 мая", opponent: "Алексей К.", result: "win", score: "5:2", duration: "2 ч", club: "Пирамида Premium" },
  { id: 2, date: "12 мая", opponent: "Сергей М.", result: "loss", score: "3:5", duration: "2 ч", club: "Green Baize" },
  { id: 3, date: "5 мая", opponent: "Иван Р.", result: "win", score: "5:4", duration: "1.5 ч", club: "Бильярдный дворец" },
  { id: 4, date: "28 апр", opponent: "Дмитрий П.", result: "win", score: "5:1", duration: "1 ч", club: "Пирамида Premium" },
];

export const RATING = [
  { rank: 1, name: "Дмитрий Соколов", score: 2840, wins: 47, avatar: "ДС", me: false },
  { rank: 2, name: "Александр Нов.", score: 2615, wins: 43, avatar: "АН", me: false },
  { rank: 3, name: "Михаил Ершов", score: 2480, wins: 38, avatar: "МЕ", me: false },
  { rank: 4, name: "Вы", score: 2340, wins: 34, avatar: "ВП", me: true },
  { rank: 5, name: "Иван Романов", score: 2190, wins: 29, avatar: "ИР", me: false },
  { rank: 6, name: "Артём Смирнов", score: 2050, wins: 25, avatar: "АС", me: false },
];

export const TABS = [
  { id: "booking", icon: "MapPin", label: "Клубы" },
  { id: "history", icon: "Clock", label: "История" },
  { id: "scan", icon: "QrCode", label: "QR" },
  { id: "profile", icon: "User", label: "Профиль" },
  { id: "more", icon: "Grid3X3", label: "Ещё" },
] as const;
