/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import Icon from "@/components/ui/icon";

// ─── Types ────────────────────────────────────────────────────────────────────
type Tab = "booking" | "scan" | "profile" | "history" | "more";
type SubPage =
  | null
  | "rating"
  | "notifications"
  | "payments"
  | "promo"
  | "records";

// ─── Mock Data ────────────────────────────────────────────────────────────────
const CLUBS = [
  { id: 1, name: "Пирамида Premium", address: "ул. Арбат, 12", rating: 4.9, tables: 8, free: 3, price: 1200, distance: "0.3 км", x: 28, y: 38, tag: "Топ" },
  { id: 2, name: "Green Baize Club", address: "Ленинский пр., 45", rating: 4.7, tables: 6, free: 1, price: 900, distance: "1.1 км", x: 55, y: 55, tag: "" },
  { id: 3, name: "Бильярдный дворец", address: "ул. Тверская, 88", rating: 4.5, tables: 12, free: 5, price: 800, distance: "2.4 км", x: 72, y: 28, tag: "Рядом" },
  { id: 4, name: "Cube & Cue", address: "Садовая-Кудринская, 9", rating: 4.8, tables: 5, free: 0, price: 1500, distance: "3.0 км", x: 40, y: 68, tag: "VIP" },
];

const HISTORY = [
  { id: 1, club: "Пирамида Premium", date: "18 мая, 20:00–22:00", table: "Стол №3", amount: 2400, status: "завершено" },
  { id: 2, club: "Green Baize Club", date: "12 мая, 15:00–17:00", table: "Стол №1", amount: 1800, status: "завершено" },
  { id: 3, club: "Бильярдный дворец", date: "5 мая, 19:00–20:30", table: "Стол №7", amount: 1200, status: "отменено" },
];

const NOTIFICATIONS = [
  { id: 1, icon: "Bell", title: "Стол освободился", text: "Стол №3 в Пирамида Premium свободен прямо сейчас", time: "5 мин", unread: true },
  { id: 2, icon: "Trophy", title: "Новое достижение", text: "Вы набрали 1000 очков рейтинга!", time: "1 ч", unread: true },
  { id: 3, icon: "Tag", title: "Промокод активирован", text: "Скидка 20% на следующее бронирование", time: "вчера", unread: false },
  { id: 4, icon: "Calendar", title: "Напоминание", text: "Ваша игра сегодня в 20:00 в Пирамида Premium", time: "вчера", unread: false },
];

const PAYMENTS = [
  { id: 1, desc: "Бронирование · Пирамида Premium", date: "18 мая", amount: -2400, type: "debit" },
  { id: 2, desc: "Пополнение баланса", date: "15 мая", amount: 5000, type: "credit" },
  { id: 3, desc: "Бронирование · Green Baize", date: "12 мая", amount: -1800, type: "debit" },
  { id: 4, desc: "Кэшбэк за бронирование", date: "12 мая", amount: 90, type: "credit" },
  { id: 5, desc: "Бронирование · Бильярдный дворец", date: "5 мая", amount: -1200, type: "debit" },
];

const RECORDS = [
  { id: 1, date: "18 мая", opponent: "Алексей К.", result: "win", score: "5:2", duration: "2 ч", club: "Пирамида Premium" },
  { id: 2, date: "12 мая", opponent: "Сергей М.", result: "loss", score: "3:5", duration: "2 ч", club: "Green Baize" },
  { id: 3, date: "5 мая", opponent: "Иван Р.", result: "win", score: "5:4", duration: "1.5 ч", club: "Бильярдный дворец" },
  { id: 4, date: "28 апр", opponent: "Дмитрий П.", result: "win", score: "5:1", duration: "1 ч", club: "Пирамида Premium" },
];

const RATING = [
  { rank: 1, name: "Дмитрий Соколов", score: 2840, wins: 47, avatar: "ДС", me: false },
  { rank: 2, name: "Александр Нов.", score: 2615, wins: 43, avatar: "АН", me: false },
  { rank: 3, name: "Михаил Ершов", score: 2480, wins: 38, avatar: "МЕ", me: false },
  { rank: 4, name: "Вы", score: 2340, wins: 34, avatar: "ВП", me: true },
  { rank: 5, name: "Иван Романов", score: 2190, wins: 29, avatar: "ИР", me: false },
  { rank: 6, name: "Артём Смирнов", score: 2050, wins: 25, avatar: "АС", me: false },
];

// ─── Components ───────────────────────────────────────────────────────────────

function AvatarBadge({ initials, size = "md" }: { initials: string; size?: "sm" | "md" | "lg" }) {
  const sizes = { sm: "w-8 h-8 text-xs", md: "w-10 h-10 text-sm", lg: "w-16 h-16 text-xl" };
  return (
    <div className={`${sizes[size]} rounded-full flex items-center justify-center font-semibold text-white flex-shrink-0`}
      style={{ background: "linear-gradient(135deg,#006048,#00a077)" }}>
      {initials}
    </div>
  );
}

function Chip({ text, variant = "default" }: { text: string; variant?: "default" | "success" | "warn" | "muted" }) {
  const s = { default: "bg-emerald-50 text-emerald-700", success: "bg-green-100 text-green-700", warn: "bg-orange-100 text-orange-700", muted: "bg-gray-100 text-gray-500" };
  return <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${s[variant]}`}>{text}</span>;
}

function SectionHeader({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>{title}</h2>
      {action && <button onClick={onAction} className="text-sm font-medium" style={{ color: "var(--emerald)" }}>{action}</button>}
    </div>
  );
}

// ─── BOOKING PAGE ─────────────────────────────────────────────────────────────
function BookingPage() {
  const [view, setView] = useState<"map" | "list">("map");
  const [selectedClub, setSelectedClub] = useState<typeof CLUBS[0] | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [date, setDate] = useState("Сегодня");

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-2 pb-3">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex-1 flex items-center gap-2 bg-white rounded-2xl px-3 py-2.5 shadow-sm border border-gray-100">
            <Icon name="Search" size={16} className="text-gray-400" />
            <span className="text-sm text-gray-400">Найти клуб...</span>
          </div>
          <button className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 bg-white">
            <Icon name="SlidersHorizontal" size={16} style={{ color: "var(--emerald)" }} />
          </button>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {["Сегодня", "Завтра", "23 мая", "24 мая", "25 мая"].map((d) => (
            <button key={d} onClick={() => setDate(d)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${date === d ? "text-white" : "bg-white border border-gray-100 text-gray-500"}`}
              style={date === d ? { background: "var(--emerald)" } : {}}>
              {d}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 mb-3">
        <div className="flex bg-white rounded-2xl p-1 shadow-sm border border-gray-100 w-fit">
          {(["map", "list"] as const).map((v) => (
            <button key={v} onClick={() => setView(v)}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-sm font-medium transition-all ${view === v ? "text-white" : "text-gray-400"}`}
              style={view === v ? { background: "var(--emerald)" } : {}}>
              <Icon name={v === "map" ? "Map" : "List"} size={14} />
              {v === "map" ? "Карта" : "Список"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-hidden relative px-4 pb-2">
        {view === "map" ? (
          <div className="relative h-full rounded-3xl overflow-hidden shadow-sm border border-gray-100"
            style={{ background: "linear-gradient(160deg, #e8f5f0 0%, #d4ece4 40%, #c5e0d8 100%)" }}>
            <svg className="absolute inset-0 w-full h-full opacity-15" viewBox="0 0 100 100" preserveAspectRatio="none">
              {[15,25,35,45,55,65,75,85].map(v => (
                <g key={v}>
                  <line x1={v} y1="0" x2={v} y2="100" stroke="#006048" strokeWidth="0.4" />
                  <line x1="0" y1={v} x2="100" y2={v} stroke="#006048" strokeWidth="0.4" />
                </g>
              ))}
            </svg>
            <svg className="absolute inset-0 w-full h-full opacity-40" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0,45 Q30,42 50,50 Q70,58 100,52" fill="none" stroke="#006048" strokeWidth="2" />
              <path d="M35,0 Q38,30 40,50 Q42,70 38,100" fill="none" stroke="#006048" strokeWidth="1.5" />
              <path d="M60,0 Q65,35 62,60 Q60,80 65,100" fill="none" stroke="#006048" strokeWidth="1" />
              <path d="M0,70 Q40,68 65,72 Q85,75 100,70" fill="none" stroke="#006048" strokeWidth="1.2" />
            </svg>
            {CLUBS.map((club) => (
              <button key={club.id} onClick={() => { setSelectedClub(club); setShowModal(true); }}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all active:scale-95"
                style={{ left: `${club.x}%`, top: `${club.y}%` }}>
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg text-white text-xs font-bold`}
                    style={{ background: club.free > 0 ? "var(--emerald)" : "#9ca3af" }}>
                    {club.free > 0 ? club.free : "—"}
                  </div>
                  <div className="mt-1 bg-white rounded-lg px-2 py-0.5 shadow text-xs font-medium" style={{ color: "var(--text-primary)" }}>
                    {club.name.split(" ")[0]}
                  </div>
                </div>
              </button>
            ))}
            <div className="absolute bottom-3 left-3 bg-white rounded-2xl px-3 py-2 shadow text-xs flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ background: "var(--emerald)" }} />
              <span className="text-gray-500">Свободно</span>
              <div className="w-3 h-3 rounded bg-gray-300 ml-1" />
              <span className="text-gray-500">Занято</span>
            </div>
          </div>
        ) : (
          <div className="overflow-y-auto h-full space-y-3">
            {CLUBS.map((club, i) => (
              <button key={club.id} onClick={() => { setSelectedClub(club); setShowModal(true); }}
                className="w-full bg-white rounded-3xl p-4 shadow-sm border border-gray-100 text-left animate-slide-up"
                style={{ animationDelay: `${i * 60}ms` }}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{club.name}</span>
                      {club.tag && <Chip text={club.tag} />}
                    </div>
                    <span className="text-xs text-gray-400">{club.address}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold" style={{ color: "var(--emerald)" }}>{club.price}₽/ч</div>
                    <div className="text-xs text-gray-400">{club.distance}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center gap-1">
                    <Icon name="Star" size={12} className="fill-amber-400 text-amber-400" />
                    <span className="text-xs font-medium">{club.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Icon name="Table2" size={12} className="text-gray-400" />
                    <span className="text-xs text-gray-400">{club.tables} столов</span>
                  </div>
                  <div className={`ml-auto flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${club.free > 0 ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-400"}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${club.free > 0 ? "bg-emerald-500" : "bg-gray-300"}`} />
                    {club.free > 0 ? `${club.free} свободно` : "Занято"}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {showModal && selectedClub && (
        <div className="fixed inset-0 z-50 flex items-end" onClick={() => setShowModal(false)}>
          <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.3)", backdropFilter: "blur(4px)" }} />
          <div className="relative w-full bg-white rounded-t-3xl p-5 animate-slide-up max-w-md mx-auto" onClick={e => e.stopPropagation()}>
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4" />
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-lg" style={{ color: "var(--text-primary)" }}>{selectedClub.name}</h3>
                <p className="text-sm text-gray-400">{selectedClub.address}</p>
              </div>
              <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-xl">
                <Icon name="Star" size={12} className="fill-amber-400 text-amber-400" />
                <span className="text-sm font-semibold text-amber-600">{selectedClub.rating}</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                { label: "Столов", value: selectedClub.tables, icon: "Table2" },
                { label: "Свободно", value: selectedClub.free, icon: "CheckCircle" },
                { label: "Цена/час", value: `${selectedClub.price}₽`, icon: "Clock" },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl p-3 text-center" style={{ background: "var(--emerald-light)" }}>
                  <Icon name={item.icon as any} size={18} className="mx-auto mb-1" style={{ color: "var(--emerald)" }} />
                  <div className="font-bold text-base" style={{ color: "var(--text-primary)" }}>{item.value}</div>
                  <div className="text-xs text-gray-400">{item.label}</div>
                </div>
              ))}
            </div>
            <button className="w-full py-3.5 rounded-2xl text-white font-semibold text-base shadow-lg transition-all"
              style={{ background: selectedClub.free > 0 ? "var(--emerald)" : "#d1d5db" }}
              disabled={selectedClub.free === 0}>
              {selectedClub.free > 0 ? "Забронировать стол" : "Все столы заняты"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SCAN PAGE ────────────────────────────────────────────────────────────────
function ScanPage() {
  const [scanned, setScanned] = useState(false);
  return (
    <div className="flex flex-col items-center justify-center h-full px-6">
      {!scanned ? (
        <>
          <div className="mb-8 text-center animate-fade-in">
            <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>Сканировать QR</h2>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Наведите камеру на QR-код стола или клуба</p>
          </div>
          <div className="relative w-64 h-64 mb-8">
            <div className="absolute inset-0 rounded-3xl overflow-hidden"
              style={{ background: "linear-gradient(135deg, #1a2e28 0%, #0d1a16 100%)" }}>
              <div className="absolute inset-4 rounded-2xl border-2 border-white/20" />
              <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-3xl">
                <div className="w-full h-0.5 opacity-80"
                  style={{ background: "linear-gradient(90deg, transparent, #00a077, transparent)", animation: "scanLine 2s ease-in-out infinite" }} />
              </div>
              {[["top-5 left-5", "border-t-2 border-l-2"], ["top-5 right-5", "border-t-2 border-r-2"],
                ["bottom-5 left-5", "border-b-2 border-l-2"], ["bottom-5 right-5", "border-b-2 border-r-2"]].map(([pos, border], i) => (
                <div key={i} className={`absolute ${pos} w-7 h-7 ${border}`} style={{ borderColor: "#00a077", borderRadius: 3 }} />
              ))}
              <Icon name="QrCode" size={52} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-15 text-white" />
            </div>
          </div>
          <button onClick={() => setScanned(true)}
            className="px-8 py-3 rounded-2xl text-white font-semibold mb-4 shadow-lg"
            style={{ background: "var(--emerald)" }}>
            Демо — сканировать
          </button>
          <p className="text-xs text-gray-400 mb-3">Или введите код вручную</p>
          <div className="flex gap-2">
            {[0,1,2,3,4,5].map(i => (
              <div key={i} className="w-9 h-11 rounded-xl border-2 border-gray-200 flex items-center justify-center" />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center animate-scale-in">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
            style={{ background: "var(--emerald)" }}>
            <Icon name="Check" size={36} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>QR распознан!</h2>
          <p className="text-sm mb-1" style={{ color: "var(--text-secondary)" }}>Пирамида Premium · Стол №3</p>
          <p className="text-xs text-gray-400 mb-6">Продолжительность: 2 часа</p>
          <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 mb-5 text-left">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-400">К оплате</span>
              <span className="font-bold text-lg" style={{ color: "var(--text-primary)" }}>2 400₽</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-400">Кэшбэк</span>
              <span className="text-sm font-medium text-green-600">+120₽</span>
            </div>
          </div>
          <button onClick={() => setScanned(false)}
            className="w-full py-3.5 rounded-2xl text-white font-semibold"
            style={{ background: "var(--emerald)" }}>
            Оплатить
          </button>
          <button onClick={() => setScanned(false)} className="mt-3 text-sm" style={{ color: "var(--text-secondary)" }}>Назад</button>
        </div>
      )}
      <style>{`@keyframes scanLine { 0%,100%{transform:translateY(-90px)} 50%{transform:translateY(90px)} }`}</style>
    </div>
  );
}

// ─── HISTORY PAGE ─────────────────────────────────────────────────────────────
function HistoryPage() {
  return (
    <div className="px-4 pb-4">
      <SectionHeader title="История броней" />
      <div className="space-y-3">
        {HISTORY.map((item, i) => (
          <div key={item.id} className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 animate-slide-up"
            style={{ animationDelay: `${i * 60}ms` }}>
            <div className="flex justify-between items-start mb-2">
              <span className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{item.club}</span>
              <Chip text={item.status} variant={item.status === "завершено" ? "success" : "warn"} />
            </div>
            <div className="flex items-center gap-1 mb-2">
              <Icon name="Calendar" size={12} className="text-gray-400" />
              <span className="text-xs text-gray-400">{item.date}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs" style={{ color: "var(--text-secondary)" }}>{item.table}</span>
              <span className="font-bold text-base" style={{ color: "var(--text-primary)" }}>{item.amount.toLocaleString()}₽</span>
            </div>
            <div className="flex gap-2 mt-3">
              <button className="flex-1 py-2 rounded-xl text-sm font-medium border border-gray-100 text-gray-500">Подробнее</button>
              {item.status === "завершено" && (
                <button className="flex-1 py-2 rounded-xl text-sm font-medium text-white" style={{ background: "var(--emerald)" }}>Повторить</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── PROFILE PAGE ─────────────────────────────────────────────────────────────
function ProfilePage({ onNav }: { onNav: (p: SubPage) => void }) {
  return (
    <div className="px-4 pb-4">
      <div className="rounded-3xl p-5 mb-4 text-white animate-fade-in"
        style={{ background: "linear-gradient(135deg, #006048 0%, #00a077 100%)" }}>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold bg-white/20">ВП</div>
          <div>
            <h2 className="text-lg font-bold">Владимир Петров</h2>
            <p className="text-sm text-white/70">+7 (999) 123-45-67</p>
          </div>
          <button className="ml-auto w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <Icon name="Edit2" size={14} className="text-white" />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[{ label: "Игр", value: "34" }, { label: "Рейтинг", value: "#4" }, { label: "Баланс", value: "1 800₽" }].map((s) => (
            <div key={s.label} className="rounded-2xl bg-white/15 p-2.5 text-center">
              <div className="font-bold text-lg">{s.value}</div>
              <div className="text-xs text-white/60">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-4">
        {[
          { icon: "Trophy", label: "Рейтинг игроков", sub: "rating" as SubPage, badge: "" },
          { icon: "Bell", label: "Уведомления", sub: "notifications" as SubPage, badge: "2" },
          { icon: "CreditCard", label: "Платежи и баланс", sub: "payments" as SubPage, badge: "" },
          { icon: "Tag", label: "Промокоды", sub: "promo" as SubPage, badge: "" },
          { icon: "Video", label: "Записи игр", sub: "records" as SubPage, badge: "" },
        ].map((item, i) => (
          <button key={item.label} onClick={() => onNav(item.sub)}
            className="w-full flex items-center px-4 py-3.5 hover:bg-gray-50 transition-colors"
            style={{ borderTop: i > 0 ? "1px solid #f3f4f6" : "none" }}>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center mr-3" style={{ background: "var(--emerald-light)" }}>
              <Icon name={item.icon as any} size={16} style={{ color: "var(--emerald)" }} />
            </div>
            <span className="flex-1 text-sm font-medium text-left" style={{ color: "var(--text-primary)" }}>{item.label}</span>
            {item.badge && (
              <span className="w-5 h-5 rounded-full text-xs font-bold text-white flex items-center justify-center mr-2"
                style={{ background: "var(--emerald)" }}>{item.badge}</span>
            )}
            <Icon name="ChevronRight" size={16} className="text-gray-300" />
          </button>
        ))}
      </div>
      <button className="w-full py-3 rounded-2xl text-sm font-medium border border-red-100 text-red-400">
        Выйти из аккаунта
      </button>
    </div>
  );
}

// ─── RATING PAGE ──────────────────────────────────────────────────────────────
function RatingPage() {
  const podiumOrder = [RATING[1], RATING[0], RATING[2]];
  const medals = ["🥈", "🥇", "🥉"];
  const heights = [76, 100, 60];
  return (
    <div className="px-4 pb-4">
      <SectionHeader title="Рейтинг игроков" />
      <div className="flex items-end justify-center gap-5 mb-6 h-36">
        {podiumOrder.map((p, i) => (
          <div key={p.rank} className="flex flex-col items-center" style={{ width: 80 }}>
            <span className="text-xl mb-1">{medals[i]}</span>
            <AvatarBadge initials={p.avatar} size="sm" />
            <div className="text-xs font-medium mt-1 text-center truncate w-full" style={{ color: "var(--text-primary)" }}>
              {p.name.split(" ")[0]}
            </div>
            <div className="w-full rounded-t-xl flex items-center justify-center text-xs font-bold text-white mt-1"
              style={{ background: "var(--emerald)", height: heights[i] * 0.36 }}>
              {p.score}
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {RATING.map((p, i) => (
          <div key={p.rank} className={`flex items-center px-4 py-3 ${p.me ? "bg-emerald-50" : ""}`}
            style={{ borderTop: i > 0 ? "1px solid #f3f4f6" : "none" }}>
            <span className="w-6 text-sm font-bold text-gray-400 mr-3">#{p.rank}</span>
            <AvatarBadge initials={p.avatar} size="sm" />
            <div className="flex-1 ml-3">
              <div className="text-sm font-semibold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                {p.name}
                {p.me && <Chip text="Вы" />}
              </div>
              <div className="text-xs text-gray-400">{p.wins} побед</div>
            </div>
            <span className="font-bold text-sm" style={{ color: "var(--emerald)" }}>{p.score.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── NOTIFICATIONS PAGE ───────────────────────────────────────────────────────
function NotificationsPage() {
  const [items, setItems] = useState(NOTIFICATIONS);
  return (
    <div className="px-4 pb-4">
      <SectionHeader title="Уведомления" action="Прочитать все"
        onAction={() => setItems(items.map(n => ({ ...n, unread: false })))} />
      <div className="space-y-3">
        {items.map((n, i) => (
          <div key={n.id}
            onClick={() => setItems(items.map(x => x.id === n.id ? { ...x, unread: false } : x))}
            className={`flex gap-3 bg-white rounded-3xl p-4 shadow-sm border transition-all animate-slide-up cursor-pointer ${n.unread ? "border-emerald-200" : "border-gray-100"}`}
            style={{ animationDelay: `${i * 50}ms` }}>
            <div className="w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center"
              style={{ background: n.unread ? "var(--emerald)" : "#f3f4f6" }}>
              <Icon name={n.icon as any} size={18} style={{ color: n.unread ? "#fff" : "#9ca3af" }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{n.title}</span>
                <span className="text-xs text-gray-400 ml-2 flex-shrink-0">{n.time}</span>
              </div>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>{n.text}</p>
            </div>
            {n.unread && <div className="w-2 h-2 rounded-full mt-1 flex-shrink-0" style={{ background: "var(--emerald)" }} />}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── PAYMENTS PAGE ────────────────────────────────────────────────────────────
function PaymentsPage() {
  return (
    <div className="px-4 pb-4">
      <div className="rounded-3xl p-5 mb-4 text-white animate-fade-in"
        style={{ background: "linear-gradient(135deg, #006048 0%, #00a077 100%)" }}>
        <p className="text-sm text-white/70 mb-1">Баланс</p>
        <p className="text-4xl font-bold mb-4">1 800 ₽</p>
        <div className="flex gap-3">
          <button className="flex-1 py-2.5 rounded-2xl bg-white/20 text-sm font-medium flex items-center justify-center gap-2">
            <Icon name="Plus" size={16} />Пополнить
          </button>
          <button className="flex-1 py-2.5 rounded-2xl bg-white/20 text-sm font-medium flex items-center justify-center gap-2">
            <Icon name="ArrowUpRight" size={16} />Вывести
          </button>
        </div>
      </div>
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "var(--emerald-light)" }}>
            <Icon name="CreditCard" size={18} style={{ color: "var(--emerald)" }} />
          </div>
          <div>
            <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>•••• •••• •••• 4242</div>
            <div className="text-xs text-gray-400">Visa · Основная карта</div>
          </div>
          <button className="ml-auto text-xs font-medium" style={{ color: "var(--emerald)" }}>Изменить</button>
        </div>
      </div>
      <SectionHeader title="Операции" />
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {PAYMENTS.map((p, i) => (
          <div key={p.id} className="flex items-center px-4 py-3"
            style={{ borderTop: i > 0 ? "1px solid #f3f4f6" : "none" }}>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center mr-3 ${p.type === "credit" ? "bg-green-100" : "bg-gray-100"}`}>
              <Icon name={p.type === "credit" ? "ArrowDownLeft" : "ArrowUpRight"} size={14}
                style={{ color: p.type === "credit" ? "#16a34a" : "#6b7280" }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>{p.desc}</div>
              <div className="text-xs text-gray-400">{p.date}</div>
            </div>
            <span className={`font-bold text-sm ml-2 ${p.type === "credit" ? "text-green-600" : ""}`}
              style={p.type === "debit" ? { color: "var(--text-primary)" } : {}}>
              {p.type === "credit" ? "+" : ""}{p.amount.toLocaleString()}₽
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── PROMO PAGE ───────────────────────────────────────────────────────────────
function PromoPage() {
  const [code, setCode] = useState("");
  const [applied, setApplied] = useState<string | null>(null);
  const promos = [
    { code: "POOL20", desc: "Скидка 20% на следующее бронирование", expires: "31 мая", used: false },
    { code: "WELCOME", desc: "50₽ на баланс за первую игру", expires: "1 июня", used: true },
  ];
  return (
    <div className="px-4 pb-4">
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 mb-5">
        <p className="text-sm font-medium mb-3" style={{ color: "var(--text-primary)" }}>Введите промокод</p>
        <div className="flex gap-2">
          <input value={code} onChange={e => setCode(e.target.value.toUpperCase())}
            placeholder="НАПРИМЕР: POOL20"
            className="flex-1 bg-gray-50 rounded-2xl px-4 py-2.5 text-sm font-mono outline-none"
            style={{ color: "var(--text-primary)" }} />
          <button onClick={() => { if (code) { setApplied(code); setCode(""); } }}
            className="px-4 py-2.5 rounded-2xl text-white text-sm font-medium"
            style={{ background: "var(--emerald)" }}>
            Применить
          </button>
        </div>
        {applied && (
          <div className="mt-3 flex items-center gap-2 text-sm text-green-600 animate-fade-in">
            <Icon name="CheckCircle" size={16} />
            <span>Промокод «{applied}» активирован!</span>
          </div>
        )}
      </div>
      <SectionHeader title="Мои промокоды" />
      <div className="space-y-3">
        {promos.map((p, i) => (
          <div key={p.code}
            className={`bg-white rounded-3xl p-4 shadow-sm border animate-slide-up ${p.used ? "opacity-60 border-gray-100" : "border-emerald-200"}`}
            style={{ animationDelay: `${i * 60}ms` }}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold font-mono text-base" style={{ color: "var(--emerald)" }}>{p.code}</span>
              <Chip text={p.used ? "Использован" : "Активен"} variant={p.used ? "muted" : "success"} />
            </div>
            <p className="text-sm mb-2" style={{ color: "var(--text-secondary)" }}>{p.desc}</p>
            <p className="text-xs text-gray-400">Действует до {p.expires}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── RECORDS PAGE ─────────────────────────────────────────────────────────────
function RecordsPage() {
  const wins = RECORDS.filter(r => r.result === "win").length;
  return (
    <div className="px-4 pb-4">
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: "Всего игр", value: RECORDS.length },
          { label: "Побед", value: wins },
          { label: "% побед", value: `${Math.round(wins / RECORDS.length * 100)}%` },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 text-center">
            <div className="text-2xl font-bold" style={{ color: "var(--emerald)" }}>{s.value}</div>
            <div className="text-xs text-gray-400 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="space-y-3">
        {RECORDS.map((r, i) => (
          <div key={r.id} className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 animate-slide-up"
            style={{ animationDelay: `${i * 60}ms` }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${r.result === "win" ? "bg-emerald-50" : "bg-orange-50"}`}>
                  <Icon name={r.result === "win" ? "Trophy" : "X"} size={16}
                    style={{ color: r.result === "win" ? "var(--emerald)" : "#f97316" }} />
                </div>
                <div>
                  <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>vs {r.opponent}</div>
                  <div className="text-xs text-gray-400">{r.date} · {r.club}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-lg" style={{ color: r.result === "win" ? "var(--emerald)" : "#f97316" }}>{r.score}</div>
                <div className="text-xs text-gray-400">{r.duration}</div>
              </div>
            </div>
            <button className="w-full py-2 rounded-xl border border-gray-100 text-sm text-gray-500 flex items-center justify-center gap-1">
              <Icon name="Video" size={12} />
              <span>Смотреть запись</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── TABS CONFIG ──────────────────────────────────────────────────────────────
const TABS = [
  { id: "booking", icon: "CalendarDays", label: "Броня" },
  { id: "scan", icon: "QrCode", label: "QR" },
  { id: "history", icon: "Clock", label: "История" },
  { id: "profile", icon: "User", label: "Профиль" },
  { id: "more", icon: "Grid3X3", label: "Ещё" },
] as const;

function MorePage({ onNav }: { onNav: (p: SubPage) => void }) {
  return (
    <div className="px-4 pb-4">
      <SectionHeader title="Ещё" />
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {[
          { icon: "Trophy", label: "Рейтинг игроков", sub: "rating" as SubPage },
          { icon: "CreditCard", label: "Платежи", sub: "payments" as SubPage },
          { icon: "Tag", label: "Промокоды", sub: "promo" as SubPage },
          { icon: "Video", label: "Записи игр", sub: "records" as SubPage },
          { icon: "HelpCircle", label: "Поддержка", sub: null },
          { icon: "Settings", label: "Настройки", sub: null },
        ].map((item, i) => (
          <button key={item.label} onClick={() => item.sub && onNav(item.sub)}
            className="w-full flex items-center px-4 py-3.5 hover:bg-gray-50 transition-colors"
            style={{ borderTop: i > 0 ? "1px solid #f3f4f6" : "none" }}>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center mr-3" style={{ background: "var(--emerald-light)" }}>
              <Icon name={item.icon as any} size={16} style={{ color: "var(--emerald)" }} />
            </div>
            <span className="flex-1 text-sm font-medium text-left" style={{ color: "var(--text-primary)" }}>{item.label}</span>
            <Icon name="ChevronRight" size={16} className="text-gray-300" />
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState<Tab>("booking");
  const [subPage, setSubPage] = useState<SubPage>(null);

  const subTitles: Record<NonNullable<SubPage>, string> = {
    rating: "Рейтинг игроков",
    notifications: "Уведомления",
    payments: "Платежи и баланс",
    promo: "Промокоды",
    records: "Записи игр",
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto font-golos relative overflow-hidden"
      style={{ background: "var(--surface-2)" }}>

      {/* Header */}
      <header className="flex items-center px-4 py-3 bg-white border-b border-gray-100 z-10 flex-shrink-0">
        {subPage ? (
          <>
            <button onClick={() => setSubPage(null)} className="w-8 h-8 flex items-center justify-center mr-2 -ml-1">
              <Icon name="ArrowLeft" size={20} style={{ color: "var(--text-primary)" }} />
            </button>
            <h1 className="font-bold text-lg" style={{ color: "var(--text-primary)" }}>{subTitles[subPage]}</h1>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 flex-1">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "var(--emerald)" }}>
                <Icon name="Table2" size={16} className="text-white" />
              </div>
              <span className="font-bold text-lg" style={{ color: "var(--text-primary)" }}>PoolPass</span>
            </div>
            <button className="relative w-8 h-8 flex items-center justify-center"
              onClick={() => setSubPage("notifications")}>
              <Icon name="Bell" size={20} style={{ color: "var(--text-primary)" }} />
              <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full" style={{ background: "var(--emerald)" }} />
            </button>
          </>
        )}
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto pt-3">
        <div className="animate-fade-in" key={subPage ?? tab}>
          {subPage === "rating" && <RatingPage />}
          {subPage === "notifications" && <NotificationsPage />}
          {subPage === "payments" && <PaymentsPage />}
          {subPage === "promo" && <PromoPage />}
          {subPage === "records" && <RecordsPage />}
          {!subPage && tab === "booking" && <BookingPage />}
          {!subPage && tab === "scan" && <ScanPage />}
          {!subPage && tab === "history" && <HistoryPage />}
          {!subPage && tab === "profile" && <ProfilePage onNav={setSubPage} />}
          {!subPage && tab === "more" && <MorePage onNav={setSubPage} />}
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-white border-t border-gray-100 z-10 flex-shrink-0">
        <div className="flex">
          {TABS.map((t) => {
            const active = !subPage && tab === t.id;
            return (
              <button key={t.id} onClick={() => { setTab(t.id as Tab); setSubPage(null); }}
                className="flex-1 flex flex-col items-center py-2.5 gap-0.5 transition-all relative">
                {t.id === "scan" ? (
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg -mt-4 mb-0.5"
                    style={{ background: active ? "var(--emerald)" : "linear-gradient(135deg,#006048,#00a077)" }}>
                    <Icon name={t.icon as any} size={22} className="text-white" />
                  </div>
                ) : (
                  <Icon name={t.icon as any} size={22} style={{ color: active ? "var(--emerald)" : "#9ca3af" }} />
                )}
                <span className="text-[10px] font-medium" style={{ color: active ? "var(--emerald)" : "#9ca3af" }}>
                  {t.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}